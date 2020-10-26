import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import Visualizations from './pages/Visualizations';
import Resources from './pages/Resources';
import About from './pages/About';
import './App.css';

const { Header, Content, Footer } = Layout;

const App = () => (
  <Router>
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Visualizations</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/resources">Resources</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/about">About</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Switch>
          <Route exact path="/">
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Cryptography Visualizer</Breadcrumb.Item>
              <Breadcrumb.Item>Visualizations</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Visualizations />
            </div>
          </Route>
          <Route exact path="/resources">
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Cryptography Visualizer</Breadcrumb.Item>
              <Breadcrumb.Item>Resources</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Resources />
            </div>
          </Route>
          <Route exact path="/about">
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Cryptography Visualizer</Breadcrumb.Item>
              <Breadcrumb.Item>About</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <About />
            </div>
          </Route>
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Cryptography Visualizer ©{new Date().getFullYear()} Created by Alex,
        Mitchell, & Brett
      </Footer>
    </Layout>
  </Router>
);

export default App;
