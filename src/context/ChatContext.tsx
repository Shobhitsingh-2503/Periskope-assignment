"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

// Define types
export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  last_message: string;
  last_message_time: string;
  participants: string[];
  unread_count: number;
  type: string;
  tags: string[];
};

export type User = {
  id: string;
  name: string;
  avatar_url: string;
  phone: string;
};

// Sample data
const sampleMessagesByConversation: Record<string, Message[]> = {
  "22222222-2222-2222-2222-222222222222": [
    {
      id: "sample-1-22222222",
      conversation_id: "22222222-2222-2222-2222-222222222222",
      sender_id: "support",
      sender_name: "Support2",
      content: "This doesn't go on Tuesday...",
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      read: true,
    },
    {
      id: "sample-2-22222222",
      conversation_id: "22222222-2222-2222-2222-222222222222",
      sender_id: "periskope",
      sender_name: "Periskope",
      content: "I understand, we can reschedule.",
      created_at: new Date(Date.now() - 82800000).toISOString(), // Yesterday, a bit later
      read: true,
    },
  ],
  "11111111-1111-1111-1111-111111111111": [
    {
      id: "sample-1-11111111",
      conversation_id: "11111111-1111-1111-1111-111111111111",
      sender_id: "roshnag",
      sender_name: "Roshnag Airtel",
      content: "Hello, South Euna!",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      read: true,
    },
    {
      id: "sample-2-11111111",
      conversation_id: "11111111-1111-1111-1111-111111111111",
      sender_id: "periskope",
      sender_name: "Periskope",
      content: "Hello, Livonia!",
      created_at: new Date(Date.now() - 169200000).toISOString(), // 2 days ago, a bit later
      read: true,
    },
  ],
  "33333333-3333-3333-3333-333333333333": [
    {
      id: "sample-1-33333333",
      conversation_id: "33333333-3333-3333-3333-333333333333",
      sender_id: "periskope",
      sender_name: "Periskope",
      content: "Test message",
      created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      read: true,
    },
    {
      id: "sample-2-33333333",
      conversation_id: "33333333-3333-3333-3333-333333333333",
      sender_id: "team",
      sender_name: "Team Member",
      content: "Got it, thanks!",
      created_at: new Date(Date.now() - 255600000).toISOString(), // 3 days ago, a bit later
      read: true,
    },
  ],
};

const initialConversations: Conversation[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Test Skope Final 5",
    last_message: "This doesn't go on Tuesday...",
    last_message_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    participants: ["Support2"],
    unread_count: 4,
    type: "Demo",
    tags: [],
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Test El Centro",
    last_message: "Hello, Livonia!",
    last_message_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    participants: ["Roshnag", "Bharat Kumar"],
    unread_count: 0,
    type: "Demo",
    tags: [],
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Periskope Team Chat",
    last_message: "Test message",
    last_message_time: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    participants: ["Team"],
    unread_count: 2,
    type: "Internal",
    tags: ["internal"],
  },
];

// Create context type
type ChatContextType = {
  conversations: Conversation[];
  currentConversation: string | null;
  currentChat: Conversation | null;
  messages: Record<string, Message[]>;
  currentMessages: Message[];
  users: User[];
  currentUser: User;
  loading: boolean;
  setCurrentConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
};

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  conversations: [],
  currentConversation: null,
  currentChat: null,
  messages: {},
  currentMessages: [],
  users: [],
  currentUser: {
    id: "",
    name: "",
    avatar_url: "",
    phone: "",
  },
  loading: true,
  setCurrentConversation: () => {},
  sendMessage: async () => {},
});

// Create provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    "22222222-2222-2222-2222-222222222222"
  );
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "periskope",
    name: "Periskope",
    avatar_url: "/images/logo.png",
    phone: "+91 99718 44008",
  });

  // Get current messages for the selected conversation
  const currentMessages = currentConversation
    ? messages[currentConversation] || []
    : [];

  // Update currentChat whenever currentConversation changes
  useEffect(() => {
    const found = conversations.find((conv) => conv.id === currentConversation);
    setCurrentChat(found || null);
  }, [currentConversation, conversations]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_time", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setConversations(data);
      } else {
        // Use initial data if no data from Supabase
        setConversations(initialConversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Fallback to initial data on error
      setConversations(initialConversations);
    }
  }, []);

  // Fetch messages for all conversations
  const fetchAllMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Group messages by conversation_id
        const messagesByConversation: Record<string, Message[]> = {};
        data.forEach((message) => {
          if (!messagesByConversation[message.conversation_id]) {
            messagesByConversation[message.conversation_id] = [];
          }
          messagesByConversation[message.conversation_id].push(message);
        });
        setMessages(messagesByConversation);
      } else {
        // Use sample messages if no data from Supabase
        setMessages(sampleMessagesByConversation);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback to sample messages on error
      setMessages(sampleMessagesByConversation);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: currentConversation,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      content,
      created_at: new Date().toISOString(),
      read: false,
    };

    try {
      // Add message to local state first for immediate UI update
      setMessages((prev) => ({
        ...prev,
        [currentConversation]: [
          ...(prev[currentConversation] || []),
          newMessage,
        ],
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation
            ? {
                ...conv,
                last_message: content,
                last_message_time: new Date().toISOString(),
              }
            : conv
        )
      );

      // Try to save to Supabase
      const { error } = await supabase.from("messages").insert([newMessage]);
      if (error) throw error;

      // Update conversation in Supabase
      await supabase
        .from("conversations")
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
        })
        .eq("id", currentConversation);
    } catch (error) {
      console.error("Error sending message:", error);
      // Message is already in local state, so no need to revert
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    const messagesSubscription = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              newMessage,
            ],
          }));
        }
      )
      .subscribe();

    const conversationsSubscription = supabase
      .channel("conversations-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(conversationsSubscription);
    };
  }, [fetchConversations]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchConversations();
    fetchAllMessages();
  }, [fetchUsers, fetchConversations, fetchAllMessages]);

  // Context value
  const value = {
    conversations,
    currentConversation,
    currentChat,
    messages,
    currentMessages,
    users,
    currentUser,
    loading,
    setCurrentConversation,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Create custom hook for using the context
export const useChat = () => useContext(ChatContext);
