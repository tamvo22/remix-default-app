import { useEffect } from 'react';
import { Form, NavLink, useNavigation, useSubmit } from '@remix-run/react';
// existing imports
import { ContactRecord } from '~/data';

export default function Sidebar({
	contacts,
	q,
}: {
	contacts: ContactRecord[];
	q: string | null;
}) {
	const submit = useSubmit();
	const navigation = useNavigation();

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has('q');

	// we still have a `useEffect` to synchronize the query
	// to the component state on back/forward button clicks
	useEffect(() => {
		if (q) {
			const searchField = document.getElementById('q');
			if (searchField instanceof HTMLInputElement) {
				searchField.value = q;
			}
		}
	}, [q]);

	return (
		<aside
			id="sidebar"
			aria-label="Sidebar menu">
			<h1>Remix Contacts</h1>
			<div>
				<Form
					id="search-form"
					role="search"
					onChange={(event) => {
						const isFirstSearch = q === null;
						submit(event.currentTarget, { replace: !isFirstSearch });
					}}>
					<input
						id="q"
						name="q"
						type="search"
						aria-label="Search contacts"
						placeholder="Search"
						className={searching ? 'loading' : ''}
						defaultValue={q || ''}
					/>
					<div
						id="search-spinner"
						aria-hidden
						hidden={!searching}
					/>
				</Form>
				<Form method="post">
					<button type="submit">New</button>
				</Form>
			</div>
			<nav>
				{contacts.length ? (
					<ul>
						{contacts.map((contact) => (
							<li key={contact.id}>
								<NavLink
									className={({ isActive, isPending }) =>
										isActive ? 'active' : isPending ? 'pending' : ''
									}
									to={`contacts/${contact.id}`}>
									{contact.first || contact.last ? (
										<>
											{contact.first} {contact.last}
										</>
									) : (
										<i>No Name</i>
									)}{' '}
									{contact.favorite ? <span>★</span> : null}
								</NavLink>
							</li>
						))}
					</ul>
				) : (
					<p>
						<i>No contacts</i>
					</p>
				)}
			</nav>
		</aside>
	);
}
