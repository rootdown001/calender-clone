import { ReactNode } from "react";

type FormGroupProps = {
  classGroup?: string;
  errorMessage?: string;
  children: ReactNode;
};

export default function FormGroup({
  classGroup = "",
  errorMessage = "",
  children,
}: FormGroupProps) {
  return (
    <div className={classGroup}>
      {children}
      {errorMessage.length > 0 && (
        <span style={{ color: "red", fontSize: "small" }}>{errorMessage}</span>
      )}
    </div>
  );
}
