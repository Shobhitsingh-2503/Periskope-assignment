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
  const [currentConversation, setCurrentConversation] = useState<
    string | null
  >();
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "periskope",
    name: "Periskope",
    avatar_url: "/images/logo.png",
    phone: "+91 99718 44008",
  });

  // Update currentChat whenever currentConversation or conversations change
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
        console.log("No Messages to display");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Fallback to initial data on error
      console.log("No Messages to display");
    }
  }, []);

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

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Use sample messages if no data from Supabase
        console.error("Error fetching messages:", error);
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
      id: `msg-${Date.now()}`,
      conversation_id: currentConversation,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      content,
      created_at: new Date().toISOString(),
      read: true,
    };

    try {
      // Add message to local state first for immediate UI update
      setMessages((prev) => [...prev, newMessage]);

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
          if (newMessage.conversation_id === currentConversation) {
            setMessages((prev) => [...prev, newMessage]);
          }
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
    currentChat,
    setCurrentConversation,
    messages,
    users,
    currentUser,
    loading,
    sendMessage,
  };
}
