import classNames from 'classnames';

import ZerveLoaderGif from '@/assets/zerve-loader.gif?url';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

const LoadingIcon = ({ className }: Props) => (
  <img
    src={ZerveLoaderGif}
    alt="Loading..."
    className={classNames(styles.loadingIcon, className)}
  />
);

export default LoadingIcon;
