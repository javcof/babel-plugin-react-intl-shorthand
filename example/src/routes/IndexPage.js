import React from 'react';
import { connect } from 'dva';
import Blog from '../components/blog';
import Other from '../components/other';

function IndexPage() {
  return (
    <div>
      <Blog />
      <br />
      <Other />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
