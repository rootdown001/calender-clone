export default function FormGroup({
  classGroup = "",
  errorMessage = "",
  children,
}) {
  return (
    <div className={classGroup}>
      {children}
      {errorMessage.length > 0 && (
        <span style={{ color: "red", fontSize: "small" }}>{errorMessage}</span>
      )}
    </div>
  );
}
