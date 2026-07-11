'use client';

import { useState } from 'react';
import { contact } from '@/lib/content';
import RevealHeading from './RevealHeading';
import Reveal from './Reveal';

const FIELDS = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
  email: (v) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email address.' : '',
  message: (v) => (v.trim().length < 10 ? 'Tell us a little more (10+ characters).' : ''),
};

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', type: 'Hosting', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const setField = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

  const validateField = (k) => () => {
    if (!FIELDS[k]) return;
    setErrors((s) => ({ ...s, [k]: FIELDS[k](values[k]) }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const next = {};
    Object.keys(FIELDS).forEach((k) => {
      const msg = FIELDS[k](values[k]);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus('submitting');
    // Placeholder submit — wire to a real endpoint / email service.
    setTimeout(() => setStatus('success'), 900);
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__intro">
          <span className="eyebrow eyebrow--accent">{contact.eyebrow}</span>
          <RevealHeading as="h2" className="contact__title h-display" lines={contact.headingLines} />
          <Reveal>
            <p className="contact__copy">{contact.copy}</p>
          </Reveal>

          <Reveal className="contact__direct" stagger={0.1}>
            <a href={`mailto:${contact.email}`} className="contact__email link-underline">
              {contact.email}
            </a>
            <div className="contact__socials">
              {contact.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" className="contact__social">
                  <span className="eyebrow">{s.label}</span>
                  <span className="contact__handle">{s.handle}</span>
                </a>
              ))}
            </div>
            <div className="contact__reps">
              {contact.representation.map((r) => (
                <div key={r.role} className="contact__rep">
                  <span className="eyebrow">{r.role}</span>
                  <span>{r.name}</span>
                  <span className="contact__rep-detail">{r.detail}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="contact__form-wrap">
          {status === 'success' ? (
            <div className="contact__success" role="status" aria-live="polite">
              <span className="contact__success-mark" aria-hidden="true">✓</span>
              <h3 className="h-display">Message received.</h3>
              <p>Thank you — expect a media kit and availability within two business days.</p>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <Field
                label="Name" name="name" value={values.name}
                onChange={setField('name')} onBlur={validateField('name')} error={errors.name}
                autoComplete="name" required
              />
              <Field
                label="Email" name="email" type="email" value={values.email}
                onChange={setField('email')} onBlur={validateField('email')} error={errors.email}
                autoComplete="email" required
              />
              <div className="field">
                <label htmlFor="type" className="field__label">Inquiry type</label>
                <div className="field__select">
                  <select id="type" name="type" value={values.type} onChange={setField('type')}>
                    <option>Hosting</option>
                    <option>Brand campaign</option>
                    <option>Editorial</option>
                    <option>Live appearance</option>
                    <option>Other</option>
                  </select>
                  <span className="field__chevron" aria-hidden="true">▾</span>
                </div>
              </div>
              <Field
                label="Details" name="message" textarea value={values.message}
                onChange={setField('message')} onBlur={validateField('message')} error={errors.message}
                helper="Dates, deliverables, budget range, and links." required
              />
              <button type="submit" className="btn form__submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', textarea, value, onChange, onBlur, error, helper, required, autoComplete }) {
  const errId = `${name}-error`;
  const helpId = `${name}-help`;
  const common = {
    id: name,
    name,
    value,
    onChange,
    onBlur,
    required,
    autoComplete,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': `${helper ? helpId : ''} ${error ? errId : ''}`.trim() || undefined,
    className: `field__input ${error ? 'field__input--error' : ''}`,
  };
  return (
    <div className="field">
      <label htmlFor={name} className="field__label">
        {label} {required && <span className="field__req" aria-hidden="true">*</span>}
      </label>
      {textarea ? (
        <textarea rows={4} {...common} />
      ) : (
        <input type={type} {...common} />
      )}
      {helper && !error && <span id={helpId} className="field__helper">{helper}</span>}
      {error && (
        <span id={errId} className="field__error" role="alert">{error}</span>
      )}
    </div>
  );
}
