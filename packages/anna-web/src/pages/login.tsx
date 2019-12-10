import React from 'react';

import Header from 'components/header';
import Input from 'components/input';

import { useSetUser } from 'context/user-context';

type Identifier = {
  username: string;
  password: string;
};

function reducer(state: Identifier, action: Partial<Identifier>): Identifier {
  return Object.assign({}, state, action);
}

const Login: React.FC<{}> = () => {
  const setUser = useSetUser();
  const [identifier, setIdentifer] = React.useReducer(reducer, {
    username: '',
    password: '',
  });
  const [error, hasError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(identifier),
      }).then(res => res.json());

      setUser({ username: identifier.username, token: result.token });
    } catch (err) {
      hasError(true);
    }
  };

  return (
    <div className="max-w-lg m-auto">
      <Header title="Login" />
      {error && (
        <div
          className="bg-red-500 rounded text-white px-4 py-3 mt-4"
          role="alert"
        >
          Invalid credential
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <Input
          name="username"
          label="Username"
          value={identifier.username}
          onChange={e => setIdentifer({ [e.target.name]: e.target.value })}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          value={identifier.password}
          onChange={e => setIdentifer({ [e.target.name]: e.target.value })}
        />
        <button
          type="submit"
          className="border-transparent border-4 bg-teal-500 hover:bg-teal-700 text-sm px-2 py-1 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
