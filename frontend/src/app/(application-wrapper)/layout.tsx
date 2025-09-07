import styles from './layout.module.css';


export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.app_container}>
      
      <main className={styles.main_content_area}>
        {children} {/* This is where your page content will be rendered */}
      </main>
    </div>
  );
}