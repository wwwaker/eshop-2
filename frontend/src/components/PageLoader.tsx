import React from 'react';
import { pageStyles } from '../pageStyles';

const PageLoader: React.FC = () => {
  return (
    <div style={pageStyles.loadingWrap} aria-label="页面加载中">
      <div style={pageStyles.loadingSpinner} />
    </div>
  );
};

export default PageLoader;
