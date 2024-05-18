import { ReactNode } from 'react';
import styles from './layout.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

function Layout({ children, className }: Props) {
  return (
    <div className={[styles.container, className].join(' ')}>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
