import React, { ReactNode, useCallback, useRef } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { Formik } from 'formik';

import styles from './AvatarUploader.css';

import FileUpload, { FileReaderFile } from '../FileUpload';

import Button from '../Button';

import AvatarUploadItem from './AvatarUploadItem';

const MSG = defineMessages({
  dropNow: {
    id: 'AvatarUploader.dropNow',
    defaultMessage: 'Drop now!',
  },
  notAllowed: {
    id: 'AvatarUploader.notAllowed',
    defaultMessage: 'Not allowed',
  },
});

export const ACCEPTED_MIME_TYPES: string[] = ['image/png', 'image/jpeg'];

export const ACCEPTED_MAX_FILE_SIZE = 2097152; // 2MB

interface Props {
  /** Only render the Uploader, no label */
  elementOnly?: boolean;

  /** Label to use */
  label: string | MessageDescriptor;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Placeholder to render when not uploading */
  placeholder: ReactNode;

  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  remove: (...args: any[]) => Promise<any>;

  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => Promise<string>;

  /** Used to control the state of the remove button (don't fire the remove action if not avatar is set) */
  isSet?: boolean;
}

const AvatarUploader = ({
  elementOnly,
  label,
  help,
  placeholder,
  remove,
  upload,
  isSet = true,
}: Props) => {
  const dropzoneRef = useRef<{ open: () => void }>();

  const choose = useCallback(() => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  }, []);

  // FileUpload children are renderProps (functions)
  const renderOverlay = () => () => (
    <div className={styles.overlay}>
      <FormattedMessage {...MSG.dropNow} />
    </div>
  );

  // Formik is used for state and error handling through FileUpload, nothing else
  return (
    <Formik onSubmit={() => {}} initialValues={{ avatarUploader: [] }}>
      <form>
        <FileUpload
          elementOnly={elementOnly}
          classNames={styles}
          dropzoneOptions={{
            accept: ACCEPTED_MIME_TYPES,
            maxSize: ACCEPTED_MAX_FILE_SIZE,
          }}
          label={label}
          help={help}
          maxFilesLimit={1}
          name="avatarUploader"
          renderPlaceholder={placeholder}
          ref={dropzoneRef}
          itemComponent={AvatarUploadItem}
          upload={upload}
        >
          {renderOverlay()}
        </FileUpload>
        <div className={styles.buttonContainer}>
          <Button
            appearance={{ theme: 'danger' }}
            text={{ id: 'button.remove' }}
            onClick={remove}
            disabled={!isSet}
            data-test="avatarUploaderRemove"
          />
          <Button
            text={{ id: 'button.choose' }}
            onClick={choose}
            data-test="avatarUploaderChoose"
          />
        </div>
      </form>
    </Formik>
  );
};

export default AvatarUploader;
