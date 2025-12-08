interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-semibold font-mono">
      {title.toLocaleUpperCase()}
    </h1>
  );
}
