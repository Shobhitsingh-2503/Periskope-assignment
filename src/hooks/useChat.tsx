"use client";

import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  type Message,
  type Conversation,
  type User,
} from "@/lib/supabaseClient";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "periskope",
    name: "Periskope",
    avatar_url: "/images/logo.png",
    phone: "+91 99718 44008",
  });

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_time", { ascending: false });

      if (error) throw error;

      if (data) {
        setConversations(data);
        // Set the first conversation as current if none is selected
        if (!currentConversation && data.length > 0) {
          setCurrentConversation(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [currentConversation]);

  // Fetch messages for the current conversation
  const fetchMessages = useCallback(async () => {
    if (!currentConversation) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", currentConversation)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }

      // If there are no messages for this conversation, add some sample messages
      if (data && data.length === 0) {
        // Create sample messages for demonstration
        const sampleMessages = [
          {
            id: `sample-1-${currentConversation}`,
            conversation_id: currentConversation,
            sender_id: "roshnag",
            sender_name: "Roshnag Airtel",
            content: "Hello, South Euna!",
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            read: true,
          },
          {
            id: `sample-2-${currentConversation}`,
            conversation_id: currentConversation,
            sender_id: "periskope",
            sender_name: "Periskope",
            content: "Test-1",
            created_at: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
            read: true,
          },
          {
            id: `sample-3-${currentConversation}`,
            conversation_id: currentConversation,
            sender_id: "roshnag",
            sender_name: "Roshnag Airtel",
            content: "CDERT",
            created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            read: true,
          },
          {
            id: `sample-4-${currentConversation}`,
            conversation_id: currentConversation,
            sender_id: "periskope",
            sender_name: "Periskope",
            content: "testing",
            created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
            read: true,
          },
        ];
        setMessages(sampleMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

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

    const newMessage = {
      conversation_id: currentConversation,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      content,
      created_at: new Date().toISOString(),
      read: true,
    };

    try {
      const { error } = await supabase.from("messages").insert([newMessage]);

      if (error) throw error;

      // Update the last message in the conversation
      await supabase
        .from("conversations")
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
        })
        .eq("id", currentConversation);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to new messages
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
          if (newMessage.conversation_id === currentConversation) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    // Subscribe to conversation updates
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
  }, [currentConversation, fetchConversations]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, [fetchUsers, fetchConversations]);

  // Fetch messages when current conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages();
    }
  }, [currentConversation, fetchMessages]);

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    users,
    currentUser,
    loading,
    sendMessage,
  };
}
