"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Image as ImageIcon, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    type: 'user' | 'teacher';
    text?: string;
    imageUrl?: string;
    timestamp: Date;
}

export default function AskTeacherWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user && isOpen) {
            loadDoubtHistory();
        }
    };

    const loadDoubtHistory = async () => {
        const { data } = await supabase
            .from("student_doubts")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(10);

        if (data && data.length > 0) {
            const history: Message[] = [];
            data.forEach((doubt) => {
                // User question
                history.push({
                    id: `q-${doubt.id}`,
                    type: 'user',
                    text: doubt.question_text,
                    imageUrl: doubt.question_image_url,
                    timestamp: new Date(doubt.created_at)
                });
                // Teacher answer
                history.push({
                    id: `a-${doubt.id}`,
                    type: 'teacher',
                    text: doubt.answer_text,
                    timestamp: new Date(doubt.created_at)
                });
            });
            setMessages(history);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputText.trim() && !selectedImage) return;
        if (!user) {
            alert("Please login to ask questions");
            return;
        }

        // Add user message to chat
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            type: 'user',
            text: inputText,
            imageUrl: imagePreview || undefined,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Clear input
        const questionText = inputText;
        const imageFile = selectedImage;
        setInputText("");
        setSelectedImage(null);
        setImagePreview(null);
        setIsLoading(true);

        try {
            const formData = new FormData();
            if (questionText) formData.append("question", questionText);
            if (imageFile) formData.append("image", imageFile);

            const response = await fetch("/api/ask-teacher", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const teacherMessage: Message = {
                    id: `teacher-${Date.now()}`,
                    type: 'teacher',
                    text: result.answer,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, teacherMessage]);
            } else {
                throw new Error(result.error || "Failed to get answer");
            }
        } catch (error: any) {
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                type: 'teacher',
                text: `Sorry, I couldn't answer your question. ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        if (user && messages.length === 0) {
            loadDoubtHistory();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-primary-600/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
                    aria-label="Ask Teacher"
                >
                    <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] w-full h-full bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 sm:border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Ask Teacher</h3>
                                <p className="text-xs text-white/80">Get instant answers</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="text-primary-600" size={32} />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Ask Your Doubts!</h4>
                                <p className="text-sm text-gray-500">
                                    Type your question or upload an image
                                </p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${message.type === 'user'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-gray-900 border border-gray-200'
                                        }`}
                                >
                                    {message.imageUrl && (
                                        <img
                                            src={message.imageUrl}
                                            alt="Question"
                                            className="rounded-lg mb-2 max-w-full"
                                        />
                                    )}
                                    {message.text && (
                                        <div className={`text-sm prose prose-sm max-w-none ${message.type === 'user' ? 'prose-invert' : ''}`}>
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="mb-2 ml-4 list-disc" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="mb-2 ml-4 list-decimal" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />,
                                                    h1: ({ node, ...props }) => <h1 className="text-base font-bold mb-2 mt-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-2 mt-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mb-1 mt-1" {...props} />,
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl p-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin text-primary-600" size={16} />
                                        <span className="text-sm text-gray-600">Teacher is typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 bg-white sm:rounded-b-2xl flex-shrink-0">
                        {imagePreview && (
                            <div className="mb-2 relative inline-block">
                                <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-end gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition flex-shrink-0"
                                disabled={isLoading}
                            >
                                <ImageIcon size={18} className="text-gray-600" />
                            </button>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                placeholder="Type your question..."
                                className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none max-h-32 min-h-[40px]"
                                rows={1}
                                style={{
                                    height: 'auto',
                                    overflowY: inputText.split('\n').length > 5 ? 'auto' : 'hidden'
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                                }}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || (!inputText.trim() && !selectedImage)}
                                className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
