// Re-mounts on every navigation, giving each page a subtle fade-in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
