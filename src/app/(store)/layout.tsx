import { StoreShell } from "@/components/store/StoreShell";

type StoreLayoutProps = {
  children: React.ReactNode;
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreShell>{children}</StoreShell>;
}
