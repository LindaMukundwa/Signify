import React, { useState } from "react";
import type { Phrase, PhraseCategory } from "../../types/phrase";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

interface AddPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (phrase: Phrase) => void;
}

export const AddPhraseModal: React.FC<AddPhraseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<PhraseCategory>("custom");

  const handleAdd = () => {
    if (text.trim()) {
      const newPhrase: Phrase = {
        id: `custom-${Date.now()}`,
        text: text.trim(),
        category,
        isDefault: false,
      };
      onAdd(newPhrase);
      setText("");
      setCategory("custom");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Phrase"
      footer={
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleAdd}
            disabled={!text.trim()}
          >
            Add Phrase
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="phrase-text">Phrase Text *</label>
          <input
            id="phrase-text"
            type="text"
            className="input"
            placeholder="Enter your phrase"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phrase-category">Category</label>
          <select
            id="phrase-category"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as PhraseCategory)}
          >
            <option value="medical">Medical</option>
            <option value="emergency">Emergency</option>
            <option value="daily">Daily</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};
