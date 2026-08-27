'use client';

import { useState } from 'react';

function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function StandupForm({ onSubmit, contributors = [], disabled = false }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getToday());
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const contributorOptions = contributors
    .map((contributor) => (typeof contributor === 'string' ? contributor : contributor?.name))
    .filter(Boolean);

  function handleSubmit(event) {
    event.preventDefault();

    const contributor = name.trim();
    const note = text.trim();

    if (!contributor) {
      setError('Add a contributor name.');
      return;
    }

    if (!date) {
      setError('Choose the standup date.');
      return;
    }

    if (note.length < 12) {
      setError('Paste a little more detail so the stomach can chew on it.');
      return;
    }

    onSubmit({
      contributor,
      date,
      text: note,
      submittedAt: new Date().toISOString(),
    });

    setText('');
    setError('');
  }

  return (
    <form className="standup-form" onSubmit={handleSubmit} aria-label="Daily standup input">
      <div className="form-grid">
        <label className="form-field">
          <span>Contributor</span>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError('');
            }}
            placeholder="Ada Lovelace"
            list="contributor-names"
            disabled={disabled}
            autoComplete="name"
          />
          <datalist id="contributor-names">
            {contributorOptions.map((contributor, index) => (
              <option key={`${contributor}-${index}`} value={contributor} />
            ))}
          </datalist>
        </label>

        <label className="form-field">
          <span>Date</span>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            disabled={disabled}
          />
        </label>
      </div>

      <label className="form-field form-field--stacked">
        <span>Standup notes</span>
        <textarea
          className="form-textarea"
          rows={9}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError('');
          }}
          placeholder={
            'Yesterday: shipped parser tests\nToday: wire coupons to blockers\nBlockers: waiting on API keys'
          }
          disabled={disabled}
        />
      </label>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="form-hint">
          Paste raw notes. Concrete progress fills the stomach; vague phrases make it rumble.
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          Feed the stomach
        </button>
      </div>
    </form>
  );
}