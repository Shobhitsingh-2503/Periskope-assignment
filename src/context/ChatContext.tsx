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
import { v4 as uuidv4 } from "uuid";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
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
        console.error("Error fetching messages:", error);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Fallback to initial data on error
      console.error("Error fetching messages:", error);
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
        console.error("Error fetching messages:", error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    currentConversation: currentConversation as string | null,
    currentChat,
    messages,
    currentMessages,
    users,
    currentUser,
    loading,
    setCurrentConversation,
    sendMessage: async (content: string) => {
      if (!content.trim() || !currentConversation) return;

      const newMessage: Message = {
        id: uuidv4(),
        conversation_id: currentConversation,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        content,
        created_at: new Date().toISOString(),
        read: false,
      };

      try {
        // Add message to local state first for immediate UI update
        // setMessages((prev) => ({
        //   ...prev,
        //   [currentConversation]: [
        //     ...(prev[currentConversation] || []),
        //     newMessage,
        //   ],
        // }));

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
        console.error(
          "Error sending message:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Create custom hook for using the context
export const useChat = () => useContext(ChatContext);
