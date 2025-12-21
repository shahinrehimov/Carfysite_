import AccountSidebar from "@/components/account/account-sidebar";
import AccountMobileNav from "@/components/account/account-mobile-nav";

export default function AccountLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <AccountSidebar />
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <AccountMobileNav />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

