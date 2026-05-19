import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X, MoreHorizontal, CheckCheck } from 'lucide-react'
import { magnitChatService } from '../../../services/magnit/chatService'

export default function ChatPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('open')
  const messagesEndRef = useRef(null)

  const fetchConversations = async () => {
    setLoadingConvs(true)
    try {
      const res = await magnitChatService.getConversations({ status: filter, limit: 50 })
      setConversations(res.data || [])
    } catch (e) { console.error(e) }
    finally { setLoadingConvs(false) }
  }

  const fetchMessages = async (convId) => {
    setLoadingMsgs(true)
    try {
      const res = await magnitChatService.getMessages(convId, { limit: 50 })
      setMessages((res.data || []).reverse())
    } catch (e) { console.error(e) }
    finally { setLoadingMsgs(false) }
  }

  useEffect(() => { fetchConversations() }, [filter])
  useEffect(() => { if (selectedConv) fetchMessages(selectedConv.id) }, [selectedConv])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !selectedConv) return
    try {
      await magnitChatService.sendMessage(selectedConv.id, { content: text })
      setText('')
      fetchMessages(selectedConv.id)
    } catch (e) { console.error(e) }
  }

  const handleClose = async () => {
    if (!selectedConv || !confirm('Закрыть диалог?')) return
    try {
      await magnitChatService.closeConversation(selectedConv.id)
      fetchConversations()
      setSelectedConv(null)
      setMessages([])
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--mg-header-h) - 56px)', borderRadius: 'var(--mg-radius-lg)', overflow: 'hidden', border: '1px solid var(--mg-border)', background: 'var(--mg-surface)', boxShadow: 'var(--mg-shadow-sm)' }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: '1px solid var(--mg-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--mg-border)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--mg-text-primary)', marginBottom: 12 }}>Чаты</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['open', 'closed'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`mg-btn mg-btn-sm ${filter === s ? 'mg-btn-primary' : 'mg-btn-secondary'}`}>
                {s === 'open' ? 'Активные' : 'Закрытые'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingConvs ? Array(5).fill(0).map((_, i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--mg-border-2)' }}>
              <div className="mg-skeleton" style={{ height: 36, borderRadius: 8 }} />
            </div>
          )) : conversations.length === 0 ? (
            <div className="mg-empty" style={{ paddingTop: 40 }}>
              <div className="mg-empty-icon"><MessageSquare size={22} /></div>
              <div className="mg-empty-title">Нет диалогов</div>
            </div>
          ) : conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              style={{ padding: '12px 16px', borderBottom: '1px solid var(--mg-border-2)', cursor: 'pointer', background: selectedConv?.id === conv.id ? 'var(--mg-surface-2)' : 'transparent', transition: 'background var(--mg-transition)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--mg-text-primary)' }}>{conv.customer_name}</span>
                {conv.unread_count > 0 && (
                  <span style={{ background: 'var(--mg-accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>{conv.unread_count}</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--mg-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.last_message || 'Нет сообщений'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--mg-text-muted)', marginTop: 3 }}>
                {conv.customer_phone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selectedConv ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--mg-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--mg-surface)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--mg-text-primary)' }}>{selectedConv.customer_name}</div>
              <div style={{ fontSize: 12, color: 'var(--mg-text-secondary)' }}>{selectedConv.customer_phone}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selectedConv.status === 'open' && (
                <button className="mg-btn mg-btn-sm mg-btn-secondary" onClick={handleClose}>Закрыть диалог</button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--mg-bg)' }}>
            {loadingMsgs ? (
              <div className="mg-empty"><div className="mg-skeleton" style={{ width: '100%', height: 60, borderRadius: 12 }} /></div>
            ) : messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '10px 14px', borderRadius: msg.sender === 'admin' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'admin' ? 'var(--mg-text-primary)' : 'var(--mg-surface)',
                  color: msg.sender === 'admin' ? '#fff' : 'var(--mg-text-primary)',
                  fontSize: 13, lineHeight: 1.5,
                  border: msg.sender === 'admin' ? 'none' : '1px solid var(--mg-border)',
                  boxShadow: 'var(--mg-shadow-sm)',
                }}>
                  <div>{msg.content}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                    <span style={{ fontSize: 10, opacity: .6 }}>{new Date(msg.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.sender === 'admin' && <CheckCheck size={12} style={{ opacity: msg.is_read ? 1 : .5 }} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {selectedConv.status === 'open' && (
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--mg-border)', display: 'flex', gap: 10 }}>
              <input
                className="mg-form-input"
                style={{ flex: 1 }}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Введите сообщение..."
              />
              <button className="mg-btn mg-btn-primary" onClick={handleSend} disabled={!text.trim()}>
                <Send size={15} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--mg-text-muted)' }}>
          <MessageSquare size={40} strokeWidth={1} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>Выберите диалог</div>
        </div>
      )}
    </div>
  )
}
