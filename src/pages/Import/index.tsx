import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [emptySubmit, setEmptySubmit] = useState<boolean>(false);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      setEmptySubmit(true);
      return;
    }
    setEmptySubmit(false);

    const fileData = new FormData();
    const [file] = uploadedFiles;

    fileData.append('file', file.file, file.name);

    try {
      await api.post('/transactions/import', fileData);

      const emptyFiles: FileProps[] = [];
      setUploadedFiles(emptyFiles);
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const uploadFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setEmptySubmit(false);
    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          {emptySubmit && <span>Selecione um arquivo para enviar</span>}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
