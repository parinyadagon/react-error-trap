export const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("This is a standard error thrown during render.");
  }
  return <div className="card success">✅ Component Rendered Successfully</div>;
};
