CREATE TYPE public."assignment2.sql" AS ENUM
    ('First Name', 'Last Name', 'Email', 'Password', 'Account_type');

ALTER TYPE public."assignment2.sql"
    OWNER TO micha79209;

INSERT INTO public.account(
	account_firstname, account_lastname, account_email, account_password
)

Values(
	'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

UPDATE public.account
	SET account_type = 'Admin'
	WHERE account_id = 1;

DELETE 
FROM 
	public.account
WHERE
	account_id = 1;

-- 4. Modify the "GM Hummer" record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- 5. Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category. Two records should be returned as a result of the query.

SELECT
    inv_make,
    inv_model,
    classification.classification_name
FROM
    inventory
INNER JOIN
    classification ON inventory.classification_id = classification.classification_id
WHERE
    classification.classification_name = 'Sport';

-- 6. Update file paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');