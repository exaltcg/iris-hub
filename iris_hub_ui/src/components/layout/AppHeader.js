import React from 'react';
import { Button, Header, Segment, Responsive } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { collapse } from '../../actions';

class AppHeader extends React.Component {

  collapse = () => {
    this.props.collapse(!this.props.collapsed);
  }

  render() {
    //console.log()

    const labelStlye = {
      color: 'white',
      fontSize: '60px',
      fontWeight: 'bold',
      fontFamily: 'ZillaSlab'
    }
    return (

      <Segment clearing style={{ backgroundColor: '#1a1919', margin: '0' }}>
        <Responsive minWidth={768}>
          <Header className="large monitor only" as='h2' floated='right' style={labelStlye}>
            moz://a
    </Header>
        </Responsive>
        <Header as='h2' floated='left' style={labelStlye}>
          <Button basic inverted icon={this.props.collapsed ? 'angle double right' : 'angle double left'} style={{ fontSize: '40px', marginTop: '-7px' }} onClick={()=>{this.collapse()}} /> iris hub

      </Header>

      </Segment>
    )
  }
}

const mapStateToProps = (state) => {
  return { collapsed: state.menu.collapsed }
}

export default connect(mapStateToProps, { collapse })(AppHeader);