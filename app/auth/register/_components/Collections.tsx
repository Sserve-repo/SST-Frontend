
type CertificateData = {
  description: string;
  uploadText: string;
};

type SubCategory = {
  name: string;
  data: CertificateData[];
};

type Category = {
  category: string;
  subCategory: SubCategory[];
};

// Categories data
export const categories: Category[] = [
  {
    category: "Home Services/Improvement",
    subCategory: [
      {
        name: "Home Care",
        data: [
          {
            description:
              "Childcare certfication/First Aid Certification (Optional)",
            uploadText:
              "click to uplolad Childcare certfication/First Aid Certification",
          },
        ],
      },
      {
        name: "Landscaping",
        data: [
          {
            description: "Horticulture certification (Optional)",
            uploadText: "click to upload Horticulture certification",
          },
        ],
      },
      {
        name: "House Decoration",
        data: [
          {
            description: "Interior design certification (Optional)",
            uploadText: "click to upload Interior design certification",
          },
        ],
      },
      {
        name: "Construction",
        data: [
          {
            description: "Building permit",
            uploadText: "click to upload Building permit",
          },
          {
            description: "Contractor's license (Optional)",
            uploadText: "Click to Upload Contractor's license",
          },
        ],
      },
    ],
  },
  {
    category: "Beauty & Fashion",
    subCategory: [
      {
        name: "Salon Services",
        data: [
          {
            description: "Health and safety certifications",
            uploadText: "Click to upload Health and safety certifications",
          },
          {
            description: "Hairstylist license",
            uploadText: "Click to upload Hairstylist license",
          },
        ],
      },
      {
        name: "Fashion Design",
        data: [
          {
            description: "Fashion Design certifications (Optional)",
            uploadText: "Click to upload Fashion Design certifications",
          },
        ],
      },
      {
        name: "Makeup & Massage",
        data: [
          {
            description: "Health and safety certifications (Optional)",
            uploadText: "Click to upload Health and safety certifications",
          },
          {
            description: "Esthetician license (Optional)",
            uploadText: "Click to upload Esthetician license",
          },
        ],
      },
    ],
  },
  {
    category: "Event Services",
    subCategory: [
      {
        name: "Event Planning",
        data: [
          {
            description: "Special Event Permits",
            uploadText: "Click to upload Special Event Permits",
          },
          {
            description: "Event planning Certification",
            uploadText: "Click to upload Event planning Certification",
          },
        ],
      },
      {
        name: "Catering Services",
        data: [
          {
            description: "Health and safety certifications (Optional)",
            uploadText: "Click to Health and safety certifications",
          },
          {
            description: "Food handling permit",
            uploadText: "Click to Food handling permit",
          },
        ],
      },
    ],
  },
  {
    category: "Custom Crafting",
    subCategory: [
      {
        name: "Custom Handmade Crafting",
        data: [
          {
            description: "Artisan/Instructor  certification",
            uploadText: "Click to upload Artisan certification",
          },
        ],
      },

      {
        name: "Craft Workshops",
        data: [
          {
            description: "Artisan/Instructor  certification (Optional)",
            uploadText: "Click to upload Artisan certification",
          },
        ],
      },
    ],
  },
  {
    category: "Mechanical & Technical",
    subCategory: [
      {
        name: "Auto Mechanics",
        data: [
          {
            description: "Mechanic certification",
            uploadText: "Click to upload Mechanic certification",
          },
        ],
      },
      {
        name: "Detailing",
        data: [
          {
            description: "Detailing certification (Optional)",
            uploadText: "Click to upload Detailing certification",
          },
        ],
      },
      {
        name: "Technical (Handyman, Carpentry, Plumbing)",
        data: [
          {
            description: "Plumber's license",
            uploadText: "Click to upload Plumber's license",
          },
        ],
      },
      {
        name: "Electrical",
        data: [
          {
            description: "Electrician's license",
            uploadText: "Click to upload Electrician's license",
          },
        ],
      },
    ],
  },
  {
    category: "Cultural & Educational",
    subCategory: [
      {
        name: "Tour Guide Services",
        data: [
          {
            description: "Tour guide certification",
            uploadText: "Click to upload Tour guide certification",
          },
        ],
      },
      {
        name: "Photography & Videography",
        data: [
          {
            description: "Photography certification (Optional)",
            uploadText: "Click to upload Photography certification",
          },
        ],
      },
      {
        name: "Language Translation Services",
        data: [
          {
            description: "Translation certification (Optional)",
            uploadText: "Click to upload Translation certification",
          },
        ],
      },
    ],
  },
];
