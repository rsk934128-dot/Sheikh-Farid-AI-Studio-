import React, { useState, useEffect } from 'react';
import {
  Mail,
  Inbox,
  Star,
  Send,
  File,
  AlertCircle,
  Tag,
  Search,
  RefreshCw,
  Plus,
  Key,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { DEMO_EMAILS } from '../data/mockData';
import { GmailLabel, GmailMessage } from '../types';

export const GmailWorkspace: React.FC = () => {
  const [labels, setLabels] = useState<GmailLabel[]>([
    { id: 'INBOX', name: 'ইনবক্স (Inbox)', type: 'system', messagesUnread: 3, messagesTotal: 24 },
    { id: 'STARRED', name: 'স্টারড (Starred)', type: 'system', messagesUnread: 0, messagesTotal: 5 },
    { id: 'IMPORTANT', name: 'জরুরি (Important)', type: 'system', messagesUnread: 1, messagesTotal: 8 },
    { id: 'SENT', name: 'প্রেরিত (Sent)', type: 'system', messagesUnread: 0, messagesTotal: 42 },
    { id: 'DRAFT', name: 'ড্রাফট (Drafts)', type: 'system', messagesUnread: 0, messagesTotal: 2 },
    {
      id: 'Label_GovTech',
      name: 'GovTech-BD',
      type: 'user',
      messagesUnread: 2,
      messagesTotal: 12,
      color: { backgroundColor: '#0f766e', textColor: '#ffffff' },
    },
    {
      id: 'Label_Projects',
      name: 'Sheikh-Studio-Projects',
      type: 'user',
      messagesUnread: 0,
      messagesTotal: 19,
      color: { backgroundColor: '#1d4ed8', textColor: '#ffffff' },
    },
    {
      id: 'Label_Security',
      name: 'Cyber-Security-Alerts',
      type: 'user',
      messagesUnread: 1,
      messagesTotal: 4,
      color: { backgroundColor: '#b91c1c', textColor: '#ffffff' },
    },
  ]);

  const [selectedLabelId, setSelectedLabelId] = useState<string>('INBOX');
  const [emails, setEmails] = useState<GmailMessage[]>(DEMO_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(DEMO_EMAILS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bearerToken, setBearerToken] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  // Fetch labels from server proxy (live or demo)
  const fetchLabels = async () => {
    try {
      const headers: Record<string, string> = {};
      if (bearerToken.trim()) {
        headers['Authorization'] = `Bearer ${bearerToken.trim()}`;
      }

      const res = await fetch('/api/workspace/gmail/labels', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.labels && data.labels.length > 0) {
          setIsDemoMode(Boolean(data.isDemo));
        }
      }
    } catch (err) {
      console.warn('Using local demo mode for Gmail labels', err);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [bearerToken]);

  // Toggle star
  const toggleStar = (e: React.MouseEvent, msgId: string) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isStarred: !m.isStarred } : m))
    );
    if (selectedEmail?.id === msgId) {
      setSelectedEmail((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
  };

  // Filter emails based on selected label & search query
  const filteredEmails = emails.filter((email) => {
    // Label check
    let matchesLabel = false;
    if (selectedLabelId === 'STARRED') {
      matchesLabel = Boolean(email.isStarred);
    } else {
      matchesLabel = email.labelIds.includes(selectedLabelId);
    }

    // Search query check
    if (!matchesLabel) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(q) ||
      email.sender.toLowerCase().includes(q) ||
      email.snippet.toLowerCase().includes(q)
    );
  });

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeData.to || !composeData.subject) return;

    const newMsg: GmailMessage = {
      id: `msg_${Date.now()}`,
      threadId: `th_${Date.now()}`,
      labelIds: ['SENT', 'INBOX'],
      sender: 'Sheikh Farid',
      senderEmail: 'sf0745026@gmail.com',
      subject: composeData.subject,
      snippet: composeData.body.slice(0, 80) + '...',
      body: composeData.body,
      date: 'এইমাত্র',
      isRead: true,
      isStarred: false,
    };

    setEmails([newMsg, ...emails]);
    setComposeOpen(false);
    setComposeData({ to: '', subject: '', body: '' });
    setSelectedEmail(newMsg);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Title & Connection Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              জিমেইল ওয়ার্কস্পেস ও লেবেল ফিল্টারিং
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Google REST API (<code className="rounded bg-slate-900 px-1 py-0.5 text-rose-300 font-mono text-xs">/users/me/labels</code>) এর মাধ্যমে রিয়েল-টাইম লেবেল রিট্রিভাল ও আধুনিক ইনবক্স ফিল্টারিং।
          </p>
        </div>

        {/* OAuth / Demo status */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
              isDemoMode
                ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            }`}
          >
            {isDemoMode ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span>ডেমো মোড সক্রিয়</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>লাইভ গুগল এপিআই সংযুক্ত</span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
          >
            <Key className="h-3.5 w-3.5 text-rose-400" />
            <span>OAuth টোকেন</span>
          </button>
        </div>
      </div>

      {/* Main Mailbox Layout: Sidebar (Labels), Mail List, Reading Pane */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden min-h-[580px]">
        {/* Left Sidebar: Labels */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-4 lg:col-span-3 space-y-4">
          <button
            onClick={() => setComposeOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>নতুন বার্তা লিখুন (Compose)</span>
          </button>

          {/* System Labels */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              সিস্টেম ফোল্ডার
            </span>
            <div className="mt-2 space-y-1">
              {labels
                .filter((l) => l.type === 'system')
                .map((lbl) => {
                  const isSelected = selectedLabelId === lbl.id;
                  const Icon =
                    lbl.id === 'INBOX'
                      ? Inbox
                      : lbl.id === 'STARRED'
                      ? Star
                      : lbl.id === 'SENT'
                      ? Send
                      : lbl.id === 'DRAFT'
                      ? File
                      : Tag;

                  return (
                    <button
                      key={lbl.id}
                      onClick={() => setSelectedLabelId(lbl.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isSelected ? 'text-rose-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{lbl.name}</span>
                      </div>
                      {lbl.messagesUnread ? (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                          {lbl.messagesUnread}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* User Custom Labels */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              কাস্টম লেবেল ফিল্টার (/users/me/labels)
            </span>
            <div className="mt-2 space-y-1">
              {labels
                .filter((l) => l.type === 'user')
                .map((lbl) => {
                  const isSelected = selectedLabelId === lbl.id;
                  return (
                    <button
                      key={lbl.id}
                      onClick={() => setSelectedLabelId(lbl.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: lbl.color?.backgroundColor || '#10b981',
                          }}
                        ></span>
                        <span className="truncate">{lbl.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {lbl.messagesTotal}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Center: Email List */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/30 lg:col-span-4 flex flex-col">
          {/* Search Header */}
          <div className="border-b border-slate-800 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ইমেইল বা প্রেরক অনুসন্ধান..."
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                এই লেবেলে কোনো মেসেজ পাওয়া যায়নি।
              </div>
            ) : (
              filteredEmails.map((msg) => {
                const isSelected = selectedEmail?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedEmail(msg)}
                    className={`cursor-pointer p-3.5 transition-colors ${
                      isSelected
                        ? 'bg-rose-950/20 border-l-2 border-rose-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 truncate max-w-[170px]">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.date}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <h4 className="line-clamp-1 text-xs font-medium text-slate-200">
                        {msg.subject}
                      </h4>
                      <button
                        onClick={(e) => toggleStar(e, msg.id)}
                        className="text-slate-500 hover:text-amber-400 shrink-0"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            msg.isStarred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-400 leading-normal">
                      {msg.snippet}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Reading Email View */}
        <div className="lg:col-span-5 bg-slate-900/40 p-5 flex flex-col justify-between">
          {selectedEmail ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedEmail.subject}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">
                      {selectedEmail.sender}
                    </span>
                    <span>&lt;{selectedEmail.senderEmail}&gt;</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">{selectedEmail.date}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {selectedEmail.labelIds.map((lid) => (
                  <span
                    key={lid}
                    className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
                  >
                    {lid}
                  </span>
                ))}
              </div>

              {/* Message Body */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans selection:bg-rose-500">
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              যেকোনো ইমেইলে ক্লিক করে বিস্তারিত পড়ুন।
            </div>
          )}
        </div>
      </div>

      {/* OAuth Token Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-rose-400" />
                <span>Google OAuth Bearer Token কনফিগারেশন</span>
              </h3>
              <button
                onClick={() => setIsTokenModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              আপনার Google Workspace জিমেইলের রিয়েল-টাইম লেবেল ফেচ করার জন্য সাময়িক Bearer এক্সেস টোকেন ইনপুট দিতে পারেন। টোকেন না থাকলে স্বয়ংক্রিয়ভাবে ডেমো মোডে চলবে।
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-300">
                Bearer Access Token:
              </label>
              <textarea
                rows={3}
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                placeholder="ya29.a0AfH6SM..."
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setBearerToken('');
                  setIsDemoMode(true);
                  setIsTokenModalOpen(false);
                }}
                className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                ডেমো মোড ব্যবহার করুন
              </button>
              <button
                onClick={() => {
                  fetchLabels();
                  setIsTokenModalOpen(false);
                }}
                className="rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-bold text-white"
              >
                টোকেন সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">নতুন বার্তা লিখুন</h3>
              <button
                onClick={() => setComposeOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400">প্রাপক (To):</label>
                <input
                  type="email"
                  required
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  placeholder="recipient@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">বিষয় (Subject):</label>
                <input
                  type="text"
                  required
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="জরুরি মিটিং বা প্রজেক্ট আপডেট"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">বার্তা (Body):</label>
                <textarea
                  rows={4}
                  required
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  placeholder="আপনার বার্তার পূর্ণ বিবরণ..."
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>পাঠান</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
