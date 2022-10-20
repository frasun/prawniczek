import { FC } from 'react'
import ShortText from './shortText'
import Modal from './modal'
import MESSAGES from '../constants/messages'

interface DocumentModalProps {
    showModal: boolean
    setShowModal: (state: boolean) => void
    documentName: string
    setDocumentName: (name: string) => void
    handleSubmit: () => void
}

const DocumentNameModal: FC<DocumentModalProps> = ({
    showModal,
    setShowModal,
    documentName,
    setDocumentName,
    handleSubmit,
}) => (
    <Modal selector='#modal'>
        <input
            id='showModal'
            type='checkbox'
            className='modal-toggle'
            checked={showModal}
            onChange={(e) => setShowModal(e.target.checked)}
        />
        <div
            className='modal'
            id='save-document-modal'>
            <div className='modal-box relative'>
                <button
                    onClick={() => setShowModal(false)}
                    className='btn btn-sm btn-circle absolute right-2 top-2'>
                    ✕
                </button>
                {MESSAGES.document.renamePlaceholder}
                <ShortText
                    answer={documentName}
                    onValueChange={(val) => setDocumentName(val as string)}
                />
                <button
                    className='btn btn-sm btn-primary'
                    disabled={documentName.length === 0}
                    onClick={handleSubmit}>
                    {MESSAGES.global.save}
                </button>
            </div>
        </div>
    </Modal>
)

export default DocumentNameModal
