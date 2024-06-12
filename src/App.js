import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
//import ClassCounter from './components/ClassCounter';
//import PostItem from './components/PostItem';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import MySelect from './components/UI/select/MySelect';
import MyInput from './components/UI/input/MyInput';
import axios from 'axios';
import PostService from './API/PostService';
import Header from './components/Header';
import Footer from './components/Footer';
// import  width  from 'dom-helpers';
import Description from './components/Description';
import Pagination from './components/UI/pagination/Pagination';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/MyModal/MyModal';
import MyButton from './components/UI/button/Mybutton';



function App() {


  const [posts, setPosts] = useState([
    { id: 1, title: 'Aa', body: 'Aaaaaa' },
    { id: 2, title: 'Bb', body: 'Bbbbbbb' },
    { id: 3, title: 'Cc', body: 'Ccccccccc' },


  ])

  const [selectedSort, setSelectedSort] = useState('')


  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  const lastPostIndex = currentPage * postsPerPage

  const firstPostIndex = lastPostIndex - postsPerPage

  const currentPost = posts.slice(firstPostIndex, lastPostIndex)





  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false);
  //const sortedPosts = [...posts].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]))


  useEffect(() => {
    fetchPosts()
  }, [])


  const sortedPosts = useMemo(() => {
    if (filter.sort) {
      return [...posts].sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]))
    }
    return posts;

  }, [filter.sort, posts])

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.title.toLowerCase().includes(filter.query.toLocaleLowerCase()))

  }, [filter.query, sortedPosts])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const sortPosts = (sort) => {
    setSelectedSort(sort);
    setPosts([...posts].sort((a, b) => a[sort].localeCompare(b[sort])))

  }

  function getSortedPosts() {
    console.log(sortedPosts)
    if (selectedSort) {
      return [...posts].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]))
    }
    return posts;
  }



  async function fetchPosts() {
    const posts = await PostService.getAll();
    setPosts(posts)
  }





  return (

    <div className="App">
      <Header />
      <div id="home" className='all_content'>
        <button style={{ marginLeft: '5 px' }} onClick={fetchPosts} >GET POSTS</button>

        <div className="App">

          <MyButton style={{ margineTop: 30 }} onClick={() => setModal(true)}>
            Создать пользователя
          </MyButton>
          <MyModal visible={modal} setVisible={setModal}>
            <PostForm create={createPost} />
          </MyModal>
          <hr style={{ margin: '15px 0' }} />

          <PostFilter
            filter={filter}
            setFilter={setFilter}
          />
            {/* это зачем тут надо было второй раз!? */}
          {/* <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Посты про JS" /> */}
            {/* кароч, я тут все лишнее удалила */}
        </div>



        {sortedAndSearchedPosts.length !== 0
          ? <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Список постов 1" />
          : <h1 style={{ textAlign: 'center' }}>Посты не найдены</h1>
        }

        <div className='container' >
          <h1 className='text-primary'>pages</h1>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={posts.length}
          />
        </div>


      </div>
      <div id="home">
        <Description />
      </div>

      <div id="contact">
        <Footer />
      </div>

    </div>
  )
}

export default App;
