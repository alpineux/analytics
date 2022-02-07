import React, { useState } from 'react';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import Button from 'components/common/Button';
import FormLayout, {
  FormButtons,
  FormError,
  FormMessage,
  FormRow,
} from 'components/layout/FormLayout';
import Logo from 'public/alpine-logo2.png';
import styles from './LoginForm.module.css';
import usePost from 'hooks/usePost';

const validate = ({ username, password }) => {
  const errors = {};

  if (!username) {
    errors.username = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }
  if (!password) {
    errors.password = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }

  return errors;
};

export default function LoginForm() {
  const post = usePost();
  const router = useRouter();
  const [message, setMessage] = useState();

  const handleSubmit = async ({ username, password }) => {
    const { ok, status, data } = await post('/api/auth/login', {
      username,
      password,
    });

    if (ok) {
      return router.push('/');
    } else {
      setMessage(
        status === 401 ? (
          <FormattedMessage
            id="message.incorrect-username-password"
            defaultMessage="Incorrect username/password."
          />
        ) : (
          data
        ),
      );
    }
  };

  return (
    <FormLayout className={styles.login}>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className={styles.header}>
              {/*<Icon icon={<Logo />} size="xlarge" className={styles.icon} />*/}
              <span className={styles.icon}>
                <Image src={Logo} width="100px" height="100px" alt="alpineUX logo" />
              </span>
              <h1 className="center">alpineUX</h1>
              <h2 style={{ fontFamily: 'HelveticaNeue' }} className="center">
                analytics
              </h2>
            </div>
            <FormRow>
              <div>
                <Field name="username" type="text" placeholder="Username" />
                <FormError name="username" />
              </div>
            </FormRow>
            <FormRow>
              <div>
                <Field name="password" type="password" placeholder="Password" />
                <FormError name="password" />
              </div>
            </FormRow>
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="label.login" defaultMessage="Login" />
              </Button>
            </FormButtons>
            <FormMessage>{message}</FormMessage>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
}
