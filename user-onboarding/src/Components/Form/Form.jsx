import React, {useState, useEffect} from 'react';
import * as yup from 'yup';
import axios from 'axios';
import Name from '../Name/Name';
import Email from '../Email/Email';
import Password from '../Password/Password';
import CheckBox from '../TermsOfService/CheckBox';
import Submit from '../SubmitButton/Submit';
import Dropdown from '../Dropdown/Dropdown';

const Form = (props) => {
      // Form State
      const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        checkbox: false,
        submit: '',
    });

    // state for errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        checkbox: false,
        role: '',
    })


    // state for post requests
    const [users, setUsers] = useState([]);

    // use yup to create form schema
    const formSchema = yup.object().shape({
        name: yup
                .string()
                .required("Name is a required field"),
        email: yup
                .string()
                .email()
                .required(),
        password: yup
                .string()
                .required('Please provide a valid password'),
        role: yup
                .string()
                .required('please select a role'),
        checkbox: yup
                .boolean()
                .oneOf([true], 'Must agree to terms to continue'),

    });

    // keep track of input state
    const inputChanged = event => {
        event.persist();
        const newFormData = {
            ...formState,
            [event.target.name] : event.target.type === 
            'checkbox' ? event.target.checked : event.target.value
        };
        validateChange(event);
        setFormState(newFormData);
    };

  // handle state when form is submitted
  const sumbitForm = event => {
    event.preventDefault();
    axios.post("https://reqres.in/api/users", formState)
        .then(res => {
            setUsers([res.data, ...users]);
     
            // clear state after submitting
            setFormState({
                name: '',
                email: '',
                password: '',
                checkbox: '',
                role: '',
            })
        })
        .catch(err => console.error(err.res)
    
    )};
  // submit button state
  const [buttonDisabled, setButtonDisabled] = useState(true);


  /** Each time the form value state is updated, check to see if it is valid per our schema.
   * This will allow us to enable/disable the submit button
   */
  useEffect(() => {
      // when input is valid change button state
      formSchema
        .isValid(formState)
        .then(valid => {
          setButtonDisabled(!valid);
        })
  }, [formState]);

  // validate changes based on schema
  const validateChange = event => {
      yup
        .reach(formSchema, event.target.name)
        .validate(event.target.value)
        .then(valid => {
            setErrors({
                ...errors, [event.target.name] : ''
            });
        })
        .catch(err => {
            setErrors({
                ...errors,
                [event.target.name] : err.errors[0]
            });
        });
  };


// convert users object to array and loop over it
const userArray = Object.entries(users);


    return (
        <React.Fragment>
        <form onSubmit={sumbitForm}> 
            <Name 
                value={formState.name}
                input={inputChanged}
            />
            {errors.name.length > 0 ? 
            (<p className='error'>{errors.name}</p>) 
            : null} 
            <Email
                value={formState.email}
                input={inputChanged}
            />
            {errors.email.length > 0 ? 
            (<p className='error'>{errors.email}</p>) 
            : null} 
            <Password
                value={formState.password}
                input={inputChanged} 
            />
            {errors.password.length > 0 ? 
            (<p className='error'>{errors.password}</p>) 
            : null} 

            <Dropdown
                onChange={inputChanged}
            />
            <CheckBox
                value={formState.checkbox}
                input={inputChanged}
            />
            {
                users.map(user => {
                    
                    return (
                        <pre>{JSON.stringify(user, null, 2)}</pre>

                    )
                })
            }
            
            <Submit
                value={formState.submit}
                input={inputChanged}
                disabled={buttonDisabled}
            />
        </form>
 
        </React.Fragment>
    );
};

export default Form;