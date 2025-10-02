// basic client-side blog with localStorage
const openFormBtn = document.getElementById('openFormBtn');
const postModal = document.getElementById('postModal');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelBtn = document.getElementById('cancelBtn');
const postForm = document.getElementById('postForm');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const postsGrid = document.getElementById('postsGrid');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

openFormBtn.addEventListener('click', () => {
  postModal.setAttribute('aria-hidden','false');
  document.getElementById('titleInput').focus();
});
closeFormBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
postModal.addEventListener('click', (e) => { if(e.target === postModal) closeModal(); });

function closeModal(){
  postModal.setAttribute('aria-hidden','true');
  postForm.reset();
  imagePreview.innerHTML = '';
  imagePreview.setAttribute('aria-hidden','true');
}

// image preview to base64 (for storage)
let imageBase64 = '';
imageInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageBase64 = reader.result;
    imagePreview.innerHTML = `<img src="${imageBase64}" alt="preview">`;
    imagePreview.setAttribute('aria-hidden','false');
  };
  reader.readAsDataURL(f);
});

// posts storage
const STORAGE_KEY = 'henok_posts_v1';
function loadPosts(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function savePosts(posts){ localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }

// render
function renderPosts(){
  const posts = loadPosts().slice().reverse(); // newest first
  postsGrid.innerHTML = '';
  if(posts.length === 0){
    postsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:30px">ምንም ፖስት የለም — አዲስ ፖስት ያክሉ!</div>`;
    return;
  }
  posts.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}">` : `<div style="height:160px;background:#eef2ff;display:flex;align-items:center;justify-content:center;color:#3b82f6">No image</div>`}
      <div class="post-content">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="post-actions">
          ${p.link ? `<a class="link-btn" href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Open Link</a>` : ''}
          <button class="del-btn" data-index="${p.id}">Delete</button>
        </div>
      </div>
    `;
    postsGrid.appendChild(card);
  });
}

// add / delete logic
postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('titleInput').value.trim();
  const desc = document.getElementById('descInput').value.trim();
  const link = document.getElementById('linkInput').value.trim();
  if(!title){ alert('እባክዎ ርዕስ ያስገቡ'); return; }
  const posts = loadPosts();
  const newPost = {
    id: Date.now(),
    title, desc, link: link || '',
    image: imageBase64 || ''
  };
  posts.push(newPost);
  savePosts(posts);
  closeModal();
  imageBase64 = '';
  renderPosts();
});

// delegation for delete
postsGrid.addEventListener('click', (e) => {
  const del = e.target.closest('.del-btn');
  if(!del) return;
  const id = Number(del.getAttribute('data-index'));
  if(!confirm('እርግጠኛ ነዎት ይህን ፖስት ማጥፋት ይፈልጋሉ?')) return;
  let posts = loadPosts();
  posts = posts.filter(p => p.id !== id);
  savePosts(posts);
  renderPosts();
});

// simple html escape
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function escapeAttr(s){ return encodeURI(s); }

// initial render
renderPosts();