import React from 'react';
import { Col, Container, Row, setConfiguration } from 'react-grid-system';
import Contribution from './components/contribution'
import Language from './components/language'
import Followers from './components/followers'
import Following from './components/following'
import BasicInfo from './components/basicInfo'
import Repos from './components/repos'
import * as Skins from '../../skins';
import './index.less';

setConfiguration({ containerWidths: [1366] })
const { Box } = Skins.Default;

function Dashboard({ match }) {
  const { params: { username } } = match
  return (
    <Container className="dash-container">
      <Row className="header">
        <Col md={12}>
          <Box title="GITHUB DATA CENTER" tHeight="60px" />
        </Col>
      </Row>
      <Row className="content">
        <Col md={3} className="left">
          <Box
            title={<div style={{ textAlign: 'left', paddingLeft: 16 }}>个人信息</div>}
            bHeight="200px"
          >
            <BasicInfo username={username} />
          </Box>
          <Box title={<div style={{ textAlign: 'left', paddingLeft: 16 }}>语言统计</div>} bHeight="250px" style={{ marginTop: 16 }}>
            <Language username={username} />
          </Box>
        </Col>
        <Col md={6} className="center">
          <Box title="项目分析" bHeight="350px">
            <Repos username={username} />
          </Box>
          <Box title="Contributions in the last year" bHeight="104px" style={{ marginTop: 16 }}>
            <Contribution username={username} />
          </Box>
        </Col>
        <Col md={3} className="right">
          <Box title={<div style={{ textAlign: 'left', paddingLeft: 16 }}>Followers</div>} bHeight="200px">
            <Followers username={username} />
          </Box>
          <Box title={<div style={{ textAlign: 'left', paddingLeft: 16 }}>Following</div>} bHeight="250px" style={{ marginTop: 16 }}>
            <Following username={username} />
          </Box>
        </Col>
      </Row>
      <Row className="footer" style={{ marginTop: 14 }}>
        <Col md={12} >
          <Box title="FOOTER" tHeight="60px" />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
