import { FormEvent, FunctionComponent, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

export const ReCaptchaView: FunctionComponent = () => {
  const captchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY ?? '';

  const handleSubmit: (e: FormEvent<HTMLFormElement>) => void = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = captchaRef.current?.getValue() ?? '';
    captchaRef.current?.reset();
    window.location.href = `/review/re-captcha/auth?token=${token}`;
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
        <button type="submit"> submit </button>
      </form>
    </>
  );
};

export default ReCaptchaView;
