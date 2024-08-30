import { useEffect } from "react";
import "./TorneiDisponibili.css";

// eslint-disable-next-line react/prop-types
const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="success-alert">{message}</div>;
};

export default SuccessAlert;
