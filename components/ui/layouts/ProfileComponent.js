import { post, get, put } from "../../../utils/api.js";
import { getUserPublicKey } from "../../../utils/walletState.js";
import { createExpandableContainer } from "../profile/ExpandableContainer.js";
import { setUser, getState } from '../../../utils/state.js';

export async function createProfileComponent(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let publicKey = getUserPublicKey();

  container.innerHTML = "";
  container.classList.add("new-parent-expanded");

  if (!publicKey) {
    container.innerHTML = "<p>Please connect your wallet.</p>";
    return;
  }

  // Render the parent layout first
  renderParentContainer(container); // pass container

  const conts = container.querySelectorAll(".cont");
  const targetCont = conts[2]; // third .cont
  createExpandableContainer("myExpandableContainer", '../../../datas/menus.json');

  if (!targetCont) {
    console.error("No third .cont found");
    return;
  }

  try {
    const data = await get(`/players/${publicKey}`);
    const playerExists = data.exists;

    if (playerExists && data.player) {
      renderPlayerProfile(targetCont, data.player); // ✅ inject into third cont
      setUser(data.player)
      // console.log(getState().user)
    } else {
      renderCreateProfileForm(targetCont, publicKey); // ✅ inject into third cont
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    targetCont.innerHTML = "<p>Error loading profile. Try again.</p>";
  }
}

function renderParentContainer(container) {
  container.innerHTML = `
      <div class="body">
        <header><h2>Player Profile</h2></header>
        <div class="parent">
          <div class="cont">
          <div id="myExpandableContainer" class="myExpandableContainer"></div>
          </div>
          <div class="cont"></div>
          <div class="cont"></div>
        </div>
      </div>
    `;
}

function renderCreateProfileForm(container, publicKey) {
  container.innerHTML = `
      <form id="profileForm">
        <label>Username</label>
        <input id="username" type="text" placeholder="Enter your username" />

        <label>Role</label>
        <select id="roles">
          <option value="gamer">Gamer</option>
          <option value="gameDev">Game Dev</option>
          <option value="artist">Artist</option>
        </select>

        <div class="avatar-upload">
          <span>Avatar Upload</span>
          <input type="file" id="avatar" accept="image/*" />
          <label for="avatar">
            <img id="avatarPreview" src="assets/images/favicon.png" alt="Preview" />
          </label>
        </div>

        <input type="submit" value="Create Profile" />
      </form>
  `;

  const avatar = container.querySelector("#avatar");
  const preview = container.querySelector("#avatarPreview");

  avatar.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (preview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  const form = container.querySelector("#profileForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const monika = form.username.value;
    const role = form.roles.value;
    const avatarUrl = preview.src;

    if (!monika || !role || !avatarUrl || !publicKey) {
      alert("Please complete all fields and connect your wallet.");
      return;
    }

    try {
      const payload = {
        monika,
        avatarUrl,
        role,
        walletAddress: publicKey,
      };

      const data = await post("/players/create", payload);

      if (data?.status !== 201 || !data?.player) {
        throw new Error(data?.message || "Invalid response from server.");
      }

      localStorage.setItem("walletAddress", publicKey);
      console.log("✅ Profile created:", data.player);
      renderPlayerProfile(container, data.player);
    } catch (err) {
      alert("❌ " + (err.message || "Failed to create profile."));
    }
  });
}
function renderPlayerProfile(container, player) {
  container.innerHTML = `
    <div class="profile-view" style="height: 60%;">
      <div class="avatar-upload">
          <input type="file" id="avatar" class="editAvatar" accept="image/*" />
          <label for="avatar">
            <img id="editAvatarPreview" src="${player.avatarUrl}" alt="Preview" />
          </label>
        </div>
      <input type="text" id="editMonika" placeholder="New Username" value="${player.monika}" style="text-align: center; font-size: 2rem;"/>
      <h3><strong>Address:</strong> ${player.walletAddress}</h3>
      <p><strong>Role:</strong> ${player.role}</p>
      
      <input type="button" value="Save Changes" id="saveChanges" />
    </div>
  `;

  const editAvatar = container.querySelector(".editAvatar");
  const preview = container.querySelector("#editAvatarPreview");

  editAvatar.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (preview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  const saveBtn = container.querySelector("#saveChanges");
  saveBtn.addEventListener("click", async () => {
    const newMonika = container.querySelector("#editMonika").value;
    const newAvatar = preview.src;

    if (!newMonika || !newAvatar) {
      alert("Both fields are required.");
      return;
    }

    try {
      const update = await put("/players/monika", {
        walletAddress: player.walletAddress,
        monika: newMonika,
        avatarUrl: newAvatar,
      });

      console.log(update);

      if (update?.status !== 201 || !update?.player) {
        throw new Error("Failed to update profile.");
      }

      alert("Profile updated!");
      renderPlayerProfile(container, {
        ...player,
        monika: newMonika,
        avatarUrl: newAvatar,
      });
    } catch (err) {
      alert("❌ " + (err.message || "Update failed"));
    }
  });
}
