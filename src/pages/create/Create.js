import { useAuthContext } from '../../hooks/useAuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

import './Create.css';
import { useFirestore } from '../../hooks/useFirestore';

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'bots', label: 'Bots' },
  { value: 'gameserver', label: 'Game Server' },
  { value: 'teamspeak', label: 'Teamspeak' },
  { value: 'discord', label: 'Discord' },
];

export const Create = () => {
  const { mode } = useTheme();
  const history = useHistory();
  const {
    user: { displayName, photoURL, uid },
  } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { addDocument, response } = useFirestore('projects');

  const onSubmit = async ({ name, details, category }) => {
    await addDocument({
      name,
      details,
      category: category.value,
      comments: [],
      status: 'open',
      createdBy: {
        displayName,
        photoURL,
        uid,
      },
      assignedUsersList: [],
    });
    if (!response.error) {
      history.push('/');
    }
  };

  return (
    <div className="create-form">
      <h2 className={`page-title ${mode}`}>Create a new ticket</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Ticket Name:</span>
          <input {...register('name', { required: true })} />
          {errors.name && <p className="error">This field is required.</p>}
        </label>
        <label>
          <span>Details:</span>
          <textarea
            rows={10}
            {...register('details', { required: true })}
          ></textarea>
          {errors.details && <p className="error">This field is required.</p>}
        </label>
        <label>
          <span>Category:</span>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Select {...field} options={categories} />}
          ></Controller>
          {errors.category && <p className="error">This field is required.</p>}
        </label>

        <button className="btn">Create Ticket</button>
      </form>
    </div>
  );
};
