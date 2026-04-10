import { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  className?: string;

  multiline?: boolean;

  prefix?: string;
  suffix?: string;
  formatDisplay?: (value: string) => string;

  isLink?: boolean;
  linkLabel?: string;
}

export function EditableCell({
  value,
  onChange,
  placeholder = '—',
  className = '',
  multiline = false,

  prefix,
  suffix,
  formatDisplay,

  isLink = false,
  linkLabel
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

  const formatted =
    formatDisplay && value ? formatDisplay(value) : value;

  const displayText =
    value
      ? `${prefix || ''}${formatted}${suffix || ''}`
      : placeholder;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
          className={`editable-input ${className}`}
          rows={3}
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
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`editable-input ${className}`}
      />
    );
  }

  return (
    <div
      className={`editable-cell ${!value ? 'editable-cell--empty' : ''} ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}
    >
      {/* EMPTY STATE */}
      {!value ? (
        <span className="editable-cell--empty">
          {placeholder}
        </span>
      ) : (
        <>
          {/* LINK MODE */}
          {isLink ? (
            <>
              <a
                href={value.startsWith('http') ? value : `https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-display"
                onClick={(e) => e.stopPropagation()}
              >
                {linkLabel || displayText}
              </a>

              {/* ✏️ EDIT BUTTON ONLY WHEN VALUE EXISTS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="link-edit-btn"
                title="Edit"
              >
                ✎
              </button>
            </>
          ) : (
            <span>{displayText}</span>
          )}
        </>
      )}
    </div>
  );
}