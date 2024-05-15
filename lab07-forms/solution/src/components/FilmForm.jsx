import dayjs from 'dayjs';

import PropTypes from 'prop-types';
import {useState} from 'react';
import {Form, Button} from 'react-bootstrap';

import { Film } from '../films.mjs';

const FilmForm = (props) => {
  /*
   * Creating a state for each parameter of the film.
   * There are two possible cases: 
   * - if we are creating a new film, the form is initialized with the default values.
   * - if we are editing a film, the form is pre-filled with the previous values.
   */
  const [title, setTitle] = useState(props.film ? props.film.title : '');
  const [favorite, setFavorite] = useState(props.film ? props.film.favorite : false);
  const [watchDate, setWatchDate] = useState((props.film && props.film.watchDate) ? props.film.watchDate.format('YYYY-MM-DD') : "");
  const [rating, setRating] = useState(props.film && props.film.rating ? props.film.rating : 0);

  // This state is used to handle error messages
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const validationErrors = {};
  
    // Title validation: title should not be empty
    if (title.trim() === '') {
      validationErrors.title = 'Title can not be empty!';
    }
  
    // Watch date validation: watch date should not be in the future
    console.log(dayjs.format);
    if (dayjs(watchDate).isAfter(dayjs())) {
      validationErrors.date='Watch date cannot be in the future!';
    }
  
    // Rating validation: rating should be between 0 and 5
    if (rating < 0 || rating > 5) {
      validationErrors.rating='Rating should be between 0 and 5!';
    }
  
    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    // console.log(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  // The form is not submitted. I.e., the film is not added.
    }

    setErrors([]);  // cleaning error array
    setTitle(title.trim());  // trim() is used for removing leading and ending whitespaces
    if(!rating)
      setRating(null);
    if(!watchDate)
      setWatchDate(null);
    const film = new Film(undefined, title.trim(), favorite, watchDate, rating);  

    if(props.film) {
      film.id = props.film.id;
      props.editFilm(film);
    }
    else
      props.addFilm(film);
  }

  return (
    <Form className="block-example border border-primary rounded mt-4 mb-0 px-5 py-4 form-padding" onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Title</Form.Label>
        {/* If there is an error related to the tile, the Form.Control becomes red */}
        <Form.Control className={errors.title ? 'wrong-field' : ''} type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Favorite" name="favorite" checked={favorite} onChange={(event) => setFavorite(event.target.checked)} />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Watch Date</Form.Label>
        { /* watchDate is an optional parameter. It have to be properly rendered only if available. */ }
        <Form.Control className={errors.date ? 'wrong-field' : ''} type="date" value={watchDate} onChange={event => {event.target.value ? setWatchDate(dayjs(event.target.value).format('YYYY-MM-DD')) : setWatchDate("")}}/>
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Rating</Form.Label>
        {/* If there is an error related to the rating, the Form.Control becomes red */}
        <Form.Control className={errors.rating ? 'wrong-field' : ''} type="number" min={0} max={5} step={1} value={rating}
          onChange={event => setRating(event.target.value === '' ? 0 : parseInt(event.target.value))}
          // You can also use directly "event.target.value" even when it is an empty string but you will see a warning in console.
        />
      </Form.Group>

      { Object.keys(errors).length > 0 ?
        <div id="errors" className='pt-1 pb-2'>
          { /* errors.map((error, index) => (<p  key={index}>{error}</p>)) } */
          Object.keys(errors).map((err, index) => ( <p className='error-message' key={index}><b>{"Error "+(index+1)+": "}</b>{errors[err]}</p> )) }
        </div>
        : ""
      }

      <Button className="mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Button className="mb-3" variant="danger" onClick={props.cancel}>Cancel</Button>
    </Form>
  )

}

FilmForm.propTypes = {
  cancel: PropTypes.func.isRequired,
  addFilm: PropTypes.func.isRequired,
  editFilm: PropTypes.func.isRequired,
  film: PropTypes.object
};

export default FilmForm;
