import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from "./Spinner"
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps={
    country:'us',
    pageSize:8,
    category:'sports'
  }
  static propTypes={
    country:PropTypes.string,
    pageSize: PropTypes.number,
    category:PropTypes.string
  }

  constructor(){
    super();
    this.state={
      articles:[],
      loading:false,
      page:1,
      totalResults:0
    }
  }

  async componentDidMount(){
    this.props.setProgress(30);
    let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.NEWS_API_KEY}&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});
    let data=await fetch(url);
    let parsedData= await data.json();
    console.log(data);
    this.setState({articles: parsedData.articles,totalArticles: parsedData.totalResults,loading:false,totalResults:parsedData.totalResults});
    this.props.setProgress(100);
  }
  handlePrevClick=async ()=>{
    this.props.setProgress(30);
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.NEWS_API_KEY}&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data=await fetch(url);
      let parsedData= await data.json();
      this.setState({
        page:this.state.page - 1,
        articles: parsedData.articles,
        loading :false,
        totalResults:parsedData.totalResults
      });
      this.props.setProgress(100);
  };
  handleNextClick= async ()=>{
      this.props.setProgress(30);
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.NEWS_API_KEY}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        let data=await fetch(url);
        let parsedData= await data.json();
        this.setState({
          page: this.state.page + 1,
          articles: parsedData.articles,
          loading: false,
          totalResults:parsedData.totalResults
        });
        this.props.setProgress(100);
    };
    fetchMoreData = async () => {
      this.props.setProgress(30);
      this.setState({page:this.state.page+1})
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.NEWS_API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data=await fetch(url);
      let parsedData= await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        loading: false,
        totalResults:parsedData.totalResults
      });
      this.props.setProgress(100);
    };
  render() {

    return (
      <>
      <h1 className="text-center" style={{margin:'35 px 0 px'}}>NewsApp - Top Headlines</h1>
        {this.state.loading && <Spinner />}
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={this.state.loading && this.state.articles.length < this.state.totalResults && <Spinner />}
          >
            <div className="container">
            <div className="row">
            {this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewsItem  title={element?element.title.slice(0,71):""} description={element.description?element.description.slice(0,76):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
          })}
          </div>
          </div>
          </InfiniteScroll>
      </>
    )
  }
}

export default News
