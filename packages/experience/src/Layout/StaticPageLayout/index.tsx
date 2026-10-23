import classNames from 'classnames';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

const StaticPageLayout = ({ className, children }: Props) => {
  return <div className={classNames(styles.wrapper, className)}>{children}</div>;
};

export default StaticPageLayout;
