
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import Linkify from "linkify-react";


import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function DocCard({
  doc,
  onDelete,
  onOpen,
  onEdit,
  isOwner = false,
  showAuthor = true, // show "By user"
  showDate = true,   // show createdAt
}) {
  if (!doc) return null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        cursor: "pointer",
        "&:hover": { boxShadow: 6 },
        mb: 2,
      }}
      onClick={() => onOpen?.(doc)}
    >
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {doc.title}
        </Typography>

        {/* Summary/Content preview */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // show max 2 lines
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                  // whiteSpace: "pre", // allow wrapping

                }}
              >
                <Linkify
                  options={{
                    target: "_blank",
                    rel: "noopener noreferrer",
                    render: ({ attributes, content }) => (
                      <a {...attributes}>Click for more info</a>
                    ),
                  }}
                >
                  {doc.summary || doc.content || ""}
                </Linkify>
              </Typography>


        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {doc.tags?.map((tag, idx) => (
            <Chip key={idx} label={tag} size="small" />
          ))}
        </Stack>

        {/* Metadata: Author + Date */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          {showAuthor && `By ${doc.createdBy?.name || "Unknown"}`}
          {showAuthor && showDate && " • "}
          {showDate && (doc.createdAt ? format(new Date(doc.createdAt), "PPP") : "")}
        </Typography>
      </CardContent>

      {/* Actions (Edit/Delete) - only if owner/admin */}
      {isOwner && (
        <CardActions>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(doc);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(doc._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
}

