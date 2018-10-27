import React from 'react';

// Components
const NAVIGATION = 'navigation';
const HEADER = 'header';
const MAIN = 'main';
const FOOTER = 'footer';

// Children
// // Navigation
const ITEM = 'item';
// // HEADER
const LOGO = 'logo';
const ACTION = 'action';
// // MAIN
const CONTENT = 'content';
// // FOOTER
const BLURB = 'blurb';

const Activator = (active = false) => {
  const statuses = {
    ACTIVATED: 'ACTIVATED',
    DEACTIVATED: 'DEACTIVATED',
  };

  const getStatuses = () => {
    return statuses;
  };

  let _active = active;
  let _activationKey = active
    ? getStatuses().ACTIVATED
    : getStatuses().DEACTIVATED;

  const isActive = () => _active;
  const compareStatus = status => status === _activationKey;
  
  const toggleActiveStatus = status => () => {
    switch (status) {
      case getStatuses().ACTIVATED: {
        _activationKey = status;
        _active = true;
        break;
      }
      case getStatuses().DEACTIVATED: {
        _activationKey = status;
        _active = false;
        break;
      }
      default: break;
    }

    return this;
  };

  const toggleBasedOnStatus = (status) => {
    if (!Object.keys(getStatuses()).includes(status)) {
      throw new Error('Activation status unsupported');
    }

    toggleActiveStatus(status)();

    return this;
  }

  const activate = () => {
    toggleActiveStatus(getStatuses().ACTIVATED);

    return this;
  }

  const deactivate = () => {
    toggleActiveStatus(getStatuses().DEACTIVATED);
    
    return this;
  }

  return {
    getStatuses,
    isActive,

    compareStatus,
    toggleBasedOnStatus,

    activate,
    deactivate,

    _active,
  };
}

class Page extends React.Component {
  // Page items
  state = {
    [NAVIGATION]: {
      [ITEM]: Activator(),
    },
    [HEADER]: {
      [LOGO]: Activator(true),
      [ACTION]: Activator(),
    },
    [MAIN]: {
      [CONTENT]: Activator(true),
    },
    [FOOTER]: {
      [BLURB]: Activator(),
    },
  };

  setActivationStatus = status => component => item => () => {
    if (!Object.keys(Activator().getStatuses()).includes(status)) {
      throw new Error('Invalid activation status provided!');
    }
    
    if (!Object.keys(this.state).includes(component)) {
      throw new Error('Invalid page component provided!');
    }
    
    const componentState = this.state[component];

    if (!Object.keys(componentState).includes(item)) {
      throw new Error('Invalid component item provided!');
    }

    const itemUnderComponent = this.state[component][item];

    if (itemUnderComponent.compareStatus(status)) return;
 
    this.setState(state => {
      itemUnderComponent.toggleBasedOnStatus(status);
      return state;
    });
  }

  // by status
  setActivatedStatus = this.setActivationStatus(Activator().getStatuses().ACTIVATED);
  setDeactivatedStatus = this.setActivationStatus(Activator().getStatuses().DEACTIVATED);

  // by component
  setActivatedStatusForNavigation = this.setActivatedStatus(NAVIGATION);
  setActivatedStatusForHeader = this.setActivatedStatus(HEADER);
  setActivatedStatusForMain = this.setActivatedStatus(MAIN);
  setActivatedStatusForFooter = this.setActivatedStatus(FOOTER);

  setDeactivatedStatusForNavigation = this.setDeactivatedStatus(NAVIGATION);
  setDeactivatedStatusForHeader = this.setDeactivatedStatus(HEADER);
  setDeactivatedStatusForMain = this.setDeactivatedStatus(MAIN);
  setDeactivatedStatusForFooter = this.setDeactivatedStatus(FOOTER);

  // by component item
  // Navigation
  setActivatedStatusForNavigationItem = this.setActivatedStatusForNavigation(ITEM);
  setDeactivatedStatusForNavigationItem = this.setDeactivatedStatusForNavigation(ITEM);
  // Header
  setActivatedStatusForHeaderLogo = this.setActivatedStatusForHeader(LOGO);
  setDeactivatedStatusForHeaderLogo = this.setDeactivatedStatusForHeader(LOGO);

  setActivatedStatusForHeaderAction = this.setActivatedStatusForHeader(ACTION);
  setDeactivatedStatusForHeaderAction = this.setDeactivatedStatusForHeader(ACTION);
  // Main
  setActivatedStatusForMainContent = this.setActivatedStatusForMain(CONTENT);
  setDeactivatedStatusForMainContent = this.setDeactivatedStatusForMain(CONTENT);
  // Footer
  setActivatedStatusForFooterBlurb = this.setActivatedStatusForFooter(BLURB);
  setDeactivatedStatusForFooterBlurb = this.setDeactivatedStatusForFooter(BLURB);

  render() {
    return (
      <div className="page">
        <aside className="page__navigation">
          <Page.Item
            onActivate={this.setActivatedStatusForNavigationItem}
            onDeactivate={this.setDeactivatedStatusForNavigationItem}
            active={this.state[NAVIGATION][ITEM].isActive()}
            color="white"
            label={ITEM} />
        </aside>
        <main>
          <header className="page__header">
            <Page.Item
              onActivate={this.setActivatedStatusForHeaderLogo}
              onDeactivate={this.setDeactivatedStatusForHeaderLogo}
              active={this.state[HEADER][LOGO].isActive()}
              color="blue"
              label={LOGO} />
            <Page.Item
              onActivate={this.setActivatedStatusForHeaderAction}
              onDeactivate={this.setDeactivatedStatusForHeaderAction}
              active={this.state[HEADER][ACTION].isActive()}
              color="green"
              label={ACTION} />
          </header>
          <section className="page__section">
            <Page.Item
              onActivate={this.setActivatedStatusForMainContent}
              onDeactivate={this.setDeactivatedStatusForMainContent}
              active={this.state[MAIN][CONTENT].isActive()}
              color="red"
              label={CONTENT} />
          </section>
          <footer className="page__footer">
            <Page.Item
              onActivate={this.setActivatedStatusForFooterBlurb}
              onDeactivate={this.setDeactivatedStatusForFooterBlurb}
              active={this.state[FOOTER][BLURB].isActive()}
              color="purple"
              label={BLURB} />
          </footer>
        </main>
      </div>
    )
  } 
}

class PageItem extends React.Component {
  static get COLORS() {
    return ['white', 'blue', 'red', 'yellow', 'purple', 'green'];
  }

  componentDidMount() {
    if (!PageItem.COLORS.includes(this.props.color)) {
      throw new Error('Unsupported color');
    }
  }

  render() {
    const { label, color, active, onActivate, onDeactivate } = this.props;
    return (
      <div className={`page__item page__item--${color}`}>
        <span className="page__item__deactivator" role="button" tabIndex="0" onClick={onDeactivate}>&times;</span>
        <span className="page__item__activator" role="button" tabIndex="0" onClick={onActivate}>{label}</span>

        <p className="page__item__status">{active ? 'active': 'inactive'}</p>
      </div>
    );
  }
}

Page.Item = PageItem;
export default Page;
