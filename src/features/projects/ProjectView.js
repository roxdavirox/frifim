import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFolderFill, BsGear, BsTrash } from 'react-icons/bs';
import { ProjectContext } from '../../app/contexts';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import { projectsActions } from './projectsDuck';

export default function ProjectView() {
  const dispatch = useDispatch();

  const {
    project: { uuid: selectedProjectUuid, name: selectedProjectName },
    setProject,
  } = React.useContext(ProjectContext);
  const project = useSelector((state) =>
    state.projects.items.find((it) => it.uuid === selectedProjectUuid)
  );
  const othersProjects = useSelector((state) =>
    state.projects.items.filter((it) => it.uuid !== selectedProjectUuid)
  );
  const { name: loadedProjectName } = project;
  const originalLoadedProjectRef = React.useRef(project);
  const [name, setName] = React.useState(project.name);
  const [isDeletionModalOpen, setDeletionModalOpen] = React.useState(false);
  const handleNameChange = (event) => setName(event.target.value);
  const noDiff = project.name.trim() === name.trim();
  const isEditing = useSelector((state) => state.projects.updating.includes(project.uuid));
  const isLoading = useSelector((state) => state.projects.isLoading);

  const openDeletionModal = () => setDeletionModalOpen(true);
  const closeDeletionModal = () => setDeletionModalOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name) {
      return;
    }

    dispatch(projectsActions.update(project.uuid, { name }));
  };

  React.useEffect(() => {
    if (selectedProjectUuid !== originalLoadedProjectRef.current.uuid) {
      originalLoadedProjectRef.current = { uuid: selectedProjectUuid, name: selectedProjectName };
      setName(selectedProjectName);
    } else if (selectedProjectName !== loadedProjectName) {
      setProject({ uuid: selectedProjectUuid, name: loadedProjectName });
    }
  }, [selectedProjectUuid, selectedProjectName, loadedProjectName, setProject]);

  return (
    <>
      <MainContainer>
        <MainHeader title="Projeto" hint={projectHint} />
        <MainSection icon={<BsGear />} title="Configuração">
          <Form onSubmit={handleSubmit}>
            <Form.Group
              as={Row}
              title="Identificação legível a humanos, curta e objetiva."
              controlId="formProjectName"
            >
              <Form.Label column sm={2}>
                Nome:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Identificador curto do projeto."
                  minLength={3}
                  maxLength={20}
                  autoComplete="off"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              title="Identificador universal único (ou UUID), para fins de manutenção do sistema."
              controlId="formProjectName"
            >
              <Form.Label column sm={2}>
                Identificador:
              </Form.Label>
              <Col sm={10}>
                <Form.Control value={project.uuid} disabled />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col className="d-flex justify-content-between" sm={{ span: 10, offset: 2 }}>
                <Button
                  type="submit"
                  variant="outline-success"
                  disabled={isEditing || noDiff}
                  title={noDiff ? 'Digite algum nome diferente antes de tentar salvar.' : ''}
                >
                  {isEditing ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="danger"
                  onClick={openDeletionModal}
                  disabled={othersProjects.length === 0}
                >
                  <BsTrash /> Deletar
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </MainSection>
        <MainSection icon={<BsFolderFill />} title="Criar ou trocar">
          <p>
            Use o <strong>seletor de projetos</strong> no menu principal do sistema. ⬆️
          </p>
          <p>Fica ao lado do seletor de meses. Use sempre que quiser.</p>
        </MainSection>
      </MainContainer>
      <DeletionModal
        isVisible={isDeletionModalOpen}
        project={project}
        fallbackProject={othersProjects[0]}
        close={closeDeletionModal}
        disabled={isLoading}
      />
    </>
  );
}

const projectHint = (
  <>
    <p>
      Projetos são como <strong>pastas para organizar</strong> seus orçamentos, transações e
      categorias.
    </p>
    <p>
      Por exemplo, você pode ter um projeto para suas finanças particulares, mas também ter outro
      para as finanças da família. Tudo isolado um do outro!
    </p>
  </>
);

export function DeletionModal({ isVisible, project, fallbackProject, close }) {
  const dispatch = useDispatch();
  const projectContext = React.useContext(ProjectContext);

  const handleDeleteProject = (uuid, fallbackProject) => () => {
    dispatch(projectsActions.delete(uuid));
    projectContext.setProject(fallbackProject);
    close();
  };

  return (
    <Modal show={isVisible} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Deletar projeto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Tem certeza que deletar o projeto <strong>{project.name}</strong>? Todos os registros
        relacionados à esse projeto também serão deletados.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleDeleteProject(project.uuid, fallbackProject)}>
          Deletar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
