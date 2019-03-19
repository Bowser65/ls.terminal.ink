import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ContentBox from '../components/ContentBox';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import MultipleInputField from '../components/MultipleInputField';
import Row from '../components/Row';
import Welcome from '../components/Welcome';
import Locations from '../data/Locations';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Localise } from '../locales';
import BotCard from '../components/BotCard';
import BotCollection from '../components/BotCollection';
import { fetchCategoriesIfNeeded } from '../redux/actions/categories';
import qs from 'qs';

class FilterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      message: null,
      owners: [],
      category: null,
      nsfw: null,
      query: null,
      timeout: null
    }
    this.form = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCategoriesIfNeeded());
    
    if (window.location.search) {
      this.search(window.location.search)
    }
  }
  componentWillUnmount() {
    if (this.state.timeout) clearTimeout(this.state.timeout);
  }
  search(searchQuery) {
    fetch(`${Locations.server}/reactjs/v1/bots/search${searchQuery}`)
      .then(res => res.json())
      .then((data) => {
        if (data.ok) {
          this.setState({
            results: data.data
          });
        } else {
          this.setState({
            message: data.message
          });
        }
      });
    
    const query = qs.parse(window.location.search.replace(/^\?/, ''));

    this.setState({
      owners: query.owners,
      category: query.category,
      nsfw: query.nsfw,
      query: query.q
    })
  }
  onChange(e) {
    const formdata = new FormData(this.form.current);
    const queryString = new URLSearchParams(formdata).toString();
    const timeout = setTimeout(() => {
      if (this.state.timeout === timeout) {
        if (queryString) {
          this.search(`?${queryString}`);
        }
      }
    }, 250)
    this.setState({
      timeout
    })
  }
  render() {
    const categories = this.props.categories.data;
    const { results, message, owners, category, nsfw, query } = this.state;
    return (
      <Layout>
        <Welcome />
        <Container>
          <form ref={this.form}>
            <ContentBox>
              <Row>
                <MultipleInputField name="owners[]" id="pages.filter.authors" value={owners} onChange={this.onChange}/>
                <InputField name="category" id="pages.filter.category" localiseOptions="categories" allowNone={true} options={categories || []} value={category} onChange={this.onChange}/>
              </Row>
              <Row>
                <InputField name="q" id="pages.filter.query" value={query} onChange={this.onChange}/>
                <InputField name="nsfw" id="pages.filter.nsfw" localiseOptions="pages.filter.nsfw" allowNone={true} options={['sfw', 'nsfw']} value={nsfw} onChange={this.onChange}/>
              </Row>
            </ContentBox>
          </form>
          {
            Array.isArray(results) ?
              <ContentBox>
                {
                  results.length === 0 ?
                    <FormattedMessage id="pages.list.empty" /> :
                    <BotCollection bots={results} />
                }
              </ContentBox> :
              null
          }
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  const { categories } = state;
  return { categories };
}

export default connect(mapStateToProps)(injectIntl(FilterPage));
