// src/ui/modal.js
export class Modal {
  constructor({ title = "Modal Title", content = "", onConfirm = () => {}, onCancel = () => {} }) {
    this.title = title;
    this.content = content;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.modalEl = null;
    this.createModal();
  }

  createModal() {
    const style = `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(107, 114, 128, 0.75);
        z-index: 50;
      }
      .modal-container {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 60;
        overflow-y: auto;
        padding: 1rem;
      }
      .modal-panel {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 32rem;
        overflow: hidden;
        animation: modalFadeIn 0.3s ease-out;
      }
      .modal-header {
        padding: 1rem;
        font-weight: 600;
        font-size: 1.125rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .modal-body {
        padding: 1rem;
        color: #374151;
        font-size: 0.875rem;
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
      }
      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 0.375rem;
        cursor: pointer;
      }
      .btn-danger {
        background-color: #dc2626;
        color: white;
        border: none;
      }
      .btn-danger:hover {
        background-color: #b91c1c;
      }
      .btn-cancel {
        background-color: white;
        border: 1px solid #d1d5db;
        color: #111827;
      }
      .btn-cancel:hover {
        background-color: #f9fafb;
      }

      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: translateY(1rem) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;

    const modalHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container" role="dialog" aria-modal="true">
        <div class="modal-panel">
          <div class="modal-header">${this.title}</div>
          <div class="modal-body">${this.content}</div>
          <div class="modal-footer">
            <button class="btn btn-danger" id="modal-confirm-btn">Deactivate</button>
            <button class="btn btn-cancel" id="modal-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.classList.add("modal-wrapper");
    wrapper.innerHTML = `<style>${style}</style>` + modalHTML;

    document.body.appendChild(wrapper);
    this.modalEl = wrapper;

    // Event listeners
    wrapper.querySelector("#modal-cancel-btn").addEventListener("click", () => {
      this.onCancel();
      this.hide();
    });

    wrapper.querySelector("#modal-confirm-btn").addEventListener("click", () => {
      this.onConfirm();
      this.hide();
    });
  }

  show() {
    this.modalEl.style.display = "block";
  }

  hide() {
    if (this.modalEl) {
      this.modalEl.remove();
    }
  }
}


// <!-- index.html -->
// <script type="module">
//   import { Modal } from './modal.js';

//   const openModalBtn = document.createElement('button');
//   openModalBtn.textContent = "Open Modal";
//   document.body.appendChild(openModalBtn);

//   openModalBtn.addEventListener("click", () => {
//     const modal = new Modal({
//       title: "Deactivate Account",
//       content: "Are you sure you want to deactivate your account? All data will be removed permanently.",
//       onConfirm: () => alert("Account Deactivated"),
//       onCancel: () => console.log("Cancelled")
//     });

//     modal.show();
//   });
// </script>