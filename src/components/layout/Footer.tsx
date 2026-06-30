export default function Footer() {
  return (
    <footer className="border-t py-8 mt-16 bg-muted/20">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} THÉONÉ Global Desk. All rights reserved.</p>
      </div>
    </footer>
  );
}
