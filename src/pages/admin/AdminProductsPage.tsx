import { AdminLayout } from '../../components/admin/AdminLayout';
import { products } from '../../data/products';

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-page-title">Produits <span className="admin-count">({products.length})</span></h1>
        <div className="admin-notice">
          La gestion complète des produits (activation, conformité, saisie des lots et certificats) sera disponible dans la prochaine version via l'API <code>/api/admin/products</code>.
        </div>
        <div className="admin-card">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Catégorie</th><th>Prix</th><th>CBD</th><th>THC</th><th>Lot</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toFixed(2).replace('.', ',')} €</td>
                  <td>{p.cbdRate ?? '—'}</td>
                  <td>{p.thcRate ?? p.thc ?? '—'}</td>
                  <td>{p.lot ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
