import { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  isLink?: boolean;
  placeholder?: string;
  className?: string;
  multiline?: boolean; // 👈 NEW
}

export function EditableCell({
  value,
  onChange,
  isLink = false,
  placeholder = '—',
  className = '',
  multiline = false // 👈 NEW
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            // ✅ Allow Enter to create new line
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
          className={`editable-input ${className}`}
          rows={3}
          style={{
            width: '100%',
            resize: 'vertical',
            whiteSpace: 'pre-wrap'
          }}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit(); // ✅ only for single line
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`editable-input ${className}`}
      />
    );
  }

  if (isLink && value) {
    return (
      <div className="link-group" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-display"
          title={value}
        >
          Link ↗
        </a>
        <button onClick={() => setEditing(true)} className="link-edit-btn" title="Edit">
          ✎
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={`editable-cell ${!value ? 'editable-cell--empty' : ''} ${className}`}
      title="Click to edit"
      style={{
        whiteSpace: multiline ? 'pre-wrap' : 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere'
      }}
    >
      {value || placeholder}
    </div>
  );
}