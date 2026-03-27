interface AlertBannerProps {
  message: string;
  tone?: "error" | "success";
}

function AlertBanner({ message, tone = "error" }: AlertBannerProps) {
  return <p className={`form-banner form-banner--${tone}`}>{message}</p>;
}

export default AlertBanner;
