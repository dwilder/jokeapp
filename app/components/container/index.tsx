export default function Container({ children }: { children: React.JSX.Element | React.JSX.Element[] }): React.JSX.Element {
  return (
    <div className="px-6 max-w-screen-lg lg:mx-auto" role="presentation">
      {children}
    </div>
  );
} 