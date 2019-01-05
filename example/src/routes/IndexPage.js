import React from 'react';
import { connect } from 'dva';
import Blog from '../components/blog';

function IndexPage() {
  return (
    <div>
      <Blog />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
