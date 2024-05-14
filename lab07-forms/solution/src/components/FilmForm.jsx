import { useState } from 'react';
import {Form, Button, Card} from 'react-bootstrap'
import dayjs from 'dayjs';

function filmForm(props){

  //const [text, setText] = useState('');
  //const [email, setEmail] = useState('');
  //const [date, setDate] = useState('');

  // If the form is being displayed to edit a question (where props.film is passed to the filmForm component [filmComponents.jsx: line 39]), the initial state of its fields is set to the values of the passed film; otherwise, we initialize it as empty

  const [title, setTitle] = useState(props.film ? props.film.title : '');
  const [favorite, setFavorite] = useState(props.film ? props.film.favorite : false);
  const [date, setDate] = useState(props.film ? props.film.watchDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  const [rating, setRating] = useState(props.film ? props.film.rating : 0);


  const handleSubmit = (event) => {
    event.preventDefault();

    const film = {title, favorite, date, rating};
    
    if(props.film) {
        props.editFilm(film, props.film.id);
        console.log('update');
        props.cancel();
    }
    else {
        props.addfilm(film);
        props.cancel();
    }

  }

return (
    <Card body >
    <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
            <Form.Label>
                Title
            </Form.Label>
            <Form.Control type='title' required={true} value={title} onChange={(event) => setTitle(event.target.value)} />
        </Form.Group>
        <Form.Group className='mb-3'>
            <Form.Check type="switch" required={false} label="Favorite" checked={favorite} onChange={(event) => setFavorite(event.target.checked)} />
        </Form.Group>
        <Form.Group className='mb-3'>
            <Form.Label>
                Date
            </Form.Label>
            <Form.Control type='date' value={date} onChange={(event) => setDate(event.target.value.format("MMMM D, YYYY"))} />
        </Form.Group>
        <Form.Group className='mb-3'>
            <Form.Label>
                Rating
            </Form.Label>
            <Form.Control type='number' min={0} max={5} value={rating} onChange={(event) => setRating(event.target.value)} />
        </Form.Group>
        {props.mode === 'Add' && <Button variant='primary' type='submit'>Add</Button>}
        {props.mode === 'Edit' && <Button variant='primary' type='submit'>Edit</Button>}
        {' '}
        <Button variant='danger' onClick={props.cancel}>Cancel</Button>
    </Form>
    </Card>
)
}

export default filmForm;

/*
<Form.Check type='checkbox' value={favorite} onChange={(event)=>setFavorite(event.target.checked)}>
                Favorite
            </Form.Check>
*/